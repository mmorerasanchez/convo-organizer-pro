import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GuideProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  slide_id: string;
  completed: boolean;
  completed_at?: string;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface GuideBookmark {
  id: string;
  user_id: string;
  chapter_id: string;
  slide_id: string;
  notes?: string;
  created_at: string;
}

export const useGuideProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GuideProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<GuideBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's progress
  const fetchProgress = async () => {
    if (!user) return;
    
    try {
      const { data: progressData } = await supabase
        .from('guide_progress')
        .select('*')
        .eq('user_id', user.id);

      const { data: bookmarkData } = await supabase
        .from('guide_bookmarks')
        .select('*')
        .eq('user_id', user.id);

      setProgress(progressData || []);
      setBookmarks(bookmarkData || []);
    } catch (error) {
      console.error('Error fetching guide progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  // Update slide completion status
  const updateSlideProgress = async (
    chapterId: string, 
    slideId: string, 
    completed: boolean,
    timeSpent: number = 0
  ) => {
    if (!user) return;

    try {
      const progressEntry = {
        user_id: user.id,
        chapter_id: chapterId,
        slide_id: slideId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        time_spent_seconds: timeSpent,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('guide_progress')
        .upsert(progressEntry, { 
          onConflict: 'user_id,chapter_id,slide_id' 
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProgress(prev => {
        const filtered = prev.filter(p => 
          !(p.chapter_id === chapterId && p.slide_id === slideId)
        );
        return [...filtered, data];
      });
    } catch (error) {
      console.error('Error updating slide progress:', error);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (chapterId: string, slideId: string, notes?: string) => {
    if (!user) return;

    try {
      const existingBookmark = bookmarks.find(b => 
        b.chapter_id === chapterId && b.slide_id === slideId
      );

      if (existingBookmark) {
        // Remove bookmark
        await supabase
          .from('guide_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        setBookmarks(prev => prev.filter(b => b.id !== existingBookmark.id));
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('guide_bookmarks')
          .insert({
            user_id: user.id,
            chapter_id: chapterId,
            slide_id: slideId,
            notes
          })
          .select()
          .single();

        if (error) throw error;

        setBookmarks(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Helper functions
  const getSlideProgress = (chapterId: string, slideId: string) => {
    return progress.find(p => p.chapter_id === chapterId && p.slide_id === slideId);
  };

  const isSlideCompleted = (chapterId: string, slideId: string) => {
    const slideProgress = getSlideProgress(chapterId, slideId);
    return slideProgress?.completed || false;
  };

  const isSlideBookmarked = (chapterId: string, slideId: string) => {
    return bookmarks.some(b => b.chapter_id === chapterId && b.slide_id === slideId);
  };

  const getChapterProgress = (chapterId: string, totalSlides: number) => {
    const completedSlides = progress.filter(p => 
      p.chapter_id === chapterId && p.completed
    ).length;
    return { completed: completedSlides, total: totalSlides };
  };

  const getTotalProgress = (totalSlides: number) => {
    const completedSlides = progress.filter(p => p.completed).length;
    return { completed: completedSlides, total: totalSlides };
  };

  return {
    progress,
    bookmarks,
    loading,
    updateSlideProgress,
    toggleBookmark,
    getSlideProgress,
    isSlideCompleted,
    isSlideBookmarked,
    getChapterProgress,
    getTotalProgress,
    refetch: fetchProgress
  };
};
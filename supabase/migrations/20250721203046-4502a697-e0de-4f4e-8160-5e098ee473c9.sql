
-- Create table for tracking user progress through guide slides
CREATE TABLE guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL,
  slide_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id, slide_id)
);

-- Create table for bookmarking important slides
CREATE TABLE guide_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL,
  slide_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id, slide_id)
);

-- Enable RLS on both tables
ALTER TABLE guide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for guide_progress
CREATE POLICY "Users can view their own guide progress" 
  ON guide_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guide progress" 
  ON guide_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide progress" 
  ON guide_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guide progress" 
  ON guide_progress FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for guide_bookmarks
CREATE POLICY "Users can view their own guide bookmarks" 
  ON guide_bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guide bookmarks" 
  ON guide_bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide bookmarks" 
  ON guide_bookmarks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guide bookmarks" 
  ON guide_bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

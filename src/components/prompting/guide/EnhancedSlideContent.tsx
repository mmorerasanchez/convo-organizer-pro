import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { useGuideProgress } from '@/hooks/useGuideProgress';
interface EnhancedSlideContentProps {
  chapterIndex: number;
  totalChapters: number;
  slideIndex: number;
  totalSlides: number;
  chapterSlidesCount: number;
  chapterId: string;
  slideId: string;
  title: string;
  content: string;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}
const EnhancedSlideContent = ({
  chapterIndex,
  totalChapters,
  slideIndex,
  totalSlides,
  chapterSlidesCount,
  chapterId,
  slideId,
  title,
  content,
  onPrevSlide,
  onNextSlide,
  onPrevChapter,
  onNextChapter
}: EnhancedSlideContentProps) => {
  const {
    updateSlideProgress,
    toggleBookmark,
    isSlideCompleted,
    isSlideBookmarked,
    getChapterProgress,
    getTotalProgress
  } = useGuideProgress();
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    setStartTime(Date.now());
    setIsCompleted(isSlideCompleted(chapterId, slideId));
    setIsBookmarked(isSlideBookmarked(chapterId, slideId));
  }, [chapterId, slideId, isSlideCompleted, isSlideBookmarked]);
  const handleCompletionChange = async (completed: boolean) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    await updateSlideProgress(chapterId, slideId, completed, timeSpent);
    setIsCompleted(completed);
  };
  const handleBookmarkToggle = async () => {
    await toggleBookmark(chapterId, slideId);
    setIsBookmarked(!isBookmarked);
  };
  const chapterProgress = getChapterProgress(chapterId, chapterSlidesCount);
  const totalProgress = getTotalProgress(totalSlides);
  const chapterProgressPercentage = chapterProgress.completed / chapterProgress.total * 100;
  const totalProgressPercentage = totalProgress.total > 0 ? totalProgress.completed / totalProgress.total * 100 : 0;
  const displayContent = content;
  // Enhanced function to render rich markdown-like content
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();

      // Handle code blocks (```)
      if (line.startsWith('```')) {
        const language = line.substring(3).trim();
        const codeLines: string[] = [];
        i++; // Move past opening ```

        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(<div key={`code-${elements.length}`} className="my-6">
            <div className="bg-muted/50 border rounded-lg overflow-hidden">
              {language && <div className="px-4 py-2 bg-muted/80 border-b text-xs font-mono text-muted-foreground">
                  {language}
                </div>}
              <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm leading-relaxed text-foreground">
                  {codeLines.join('\n')}
                </code>
              </pre>
            </div>
          </div>);
        i++; // Move past closing ```
        continue;
      }

      // Handle blockquotes (>)
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(<blockquote key={`quote-${elements.length}`} className="border-l-4 border-primary/30 pl-4 my-4 text-muted-foreground bg-muted/20 py-2 rounded-r">
            {quoteLines.map((quoteLine, idx) => <p key={idx} className="leading-relaxed">
                {renderInlineFormatting(quoteLine)}
              </p>)}
          </blockquote>);
        continue;
      }

      // Handle tables (GitHub-style Markdown)
      if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[:\-\|\s]+\|?\s*$/.test(lines[i + 1].trim())) {
        const headerLine = line;
        const separatorLine = lines[i + 1].trim();
        const splitCells = (row: string) => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
        const headers = splitCells(headerLine);
        const aligns = splitCells(separatorLine).map(s => {
          const left = s.startsWith(':');
          const right = s.endsWith(':');
          if (left && right) return 'center';
          if (right) return 'right';
          return 'left';
        });
        i += 2; // move past header and separator
        const rows: string[][] = [];
        while (i < lines.length && lines[i].trim() !== '' && lines[i].includes('|') && !/^\s*`{3}/.test(lines[i].trim())) {
          rows.push(splitCells(lines[i].trim()));
          i++;
        }
        elements.push(<div key={`table-${elements.length}`} className="my-6 overflow-x-auto">
            <table className="w-full text-sm border rounded-md border-border/60">
              <thead className="bg-muted/40">
                <tr>
                  {headers.map((h, idx) => <th key={idx} className={`px-3 py-2 text-foreground border-b border-border/60 ${aligns[idx] === 'center' ? 'text-center' : aligns[idx] === 'right' ? 'text-right' : 'text-left'}`}>
                      {renderInlineFormatting(h)}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, ridx) => <tr key={ridx} className="odd:bg-background even:bg-muted/20">
                    {headers.map((_, cidx) => <td key={cidx} className={`px-3 py-2 border-t border-border/60 align-top ${aligns[cidx] === 'center' ? 'text-center' : aligns[cidx] === 'right' ? 'text-right' : 'text-left'}`}>
                        {renderInlineFormatting(r[cidx] ?? '')}
                      </td>)}
                  </tr>)}
              </tbody>
            </table>
          </div>);
        continue;
      }

      // Handle headers (##, ###)
      else if (line.startsWith('### ')) {
        elements.push(<h4 key={`h4-${elements.length}`} className="text-lg font-semibold mt-8 mb-4 first:mt-0 text-foreground">
            {renderInlineFormatting(line.substring(4))}
          </h4>);
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={`h3-${elements.length}`} className="text-xl font-semibold mt-8 mb-4 first:mt-0 text-foreground">
            {renderInlineFormatting(line.substring(3))}
          </h3>);
      }
      // Handle list items (-, *, +)
      else if (line.match(/^[\-\*\+]\s/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^[\-\*\+]\s/)) {
          listItems.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(<ul key={`list-${elements.length}`} className="space-y-2 my-4 ml-4">
            {listItems.map((item, idx) => <li key={idx} className="flex items-start space-x-3">
                <span className="text-primary mt-1.5 shrink-0">•</span>
                <span className="text-muted-foreground leading-relaxed text-justify">
                  {renderInlineFormatting(item)}
                </span>
              </li>)}
          </ul>);
        continue;
      }
      // Handle numbered lists (1., 2., etc.)
      else if (line.match(/^\d+\.\s/)) {
        const listItems: string[] = [];
        let counter = 1;
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(<ol key={`ordered-list-${elements.length}`} className="space-y-2 my-4 ml-4">
            {listItems.map((item, idx) => <li key={idx} className="flex items-start space-x-3">
                <span className="text-primary mt-0.5 shrink-0 font-medium text-sm">
                  {idx + 1}.
                </span>
                <span className="text-muted-foreground leading-relaxed text-justify">
                  {renderInlineFormatting(item)}
                </span>
              </li>)}
          </ol>);
        continue;
      }
      // Handle regular paragraphs
      else if (line !== '') {
        elements.push(<p key={`p-${elements.length}`} className="text-muted-foreground leading-relaxed text-justify mb-4">
            {renderInlineFormatting(line)}
          </p>);
      }
      // Handle empty lines
      else {
        elements.push(<div key={`space-${elements.length}`} className="h-4"></div>);
      }
      i++;
    }
    return <div className="space-y-2">{elements}</div>;
  };

  // Function to handle inline formatting (bold, italic, code, links)
  const renderInlineFormatting = (text: string): React.ReactNode => {
    if (!text) return text;

    // Split by multiple patterns and process each part
    const patterns = [{
      regex: /\*\*(.+?)\*\*/g,
      component: (match: string) => <strong className="text-foreground font-semibold">{match}</strong>
    }, {
      regex: /\*(.+?)\*/g,
      component: (match: string) => <span>{match}</span>
    }, {
      regex: /`(.+?)`/g,
      component: (match: string) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border">{match}</code>
    }];
    let result: React.ReactNode[] = [text];

    // Handle non-link patterns first
    patterns.forEach(({
      regex,
      component
    }) => {
      result = result.flatMap((item, index) => {
        if (typeof item !== 'string') return item;
        const parts = item.split(regex);
        const newResult: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            if (parts[i]) newResult.push(parts[i]);
          } else {
            newResult.push(React.cloneElement(component(parts[i]) as React.ReactElement, {
              key: `format-${index}-${i}`
            }));
          }
        }
        return newResult.length > 0 ? newResult : [item];
      });
    });

    // Handle link pattern separately
    result = result.flatMap((item, index) => {
      if (typeof item !== 'string') return item;
      const linkRegex = /\[(.+?)\]\((.+?)\)/g;
      const parts = item.split(linkRegex);
      const newResult: React.ReactNode[] = [];
      for (let i = 0; i < parts.length; i += 3) {
        // Add regular text
        if (parts[i]) newResult.push(parts[i]);

        // Add link if we have both text and URL
        if (parts[i + 1] && parts[i + 2]) {
          newResult.push(<a key={`link-${index}-${i}`} href={parts[i + 2]} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {parts[i + 1]}
            </a>);
        }
      }
      return newResult.length > 0 ? newResult : [item];
    });
    return result;
  };
  return <div className="space-y-4">
      {/* Chapter Progress */}
      

      {/* Main Slide Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                Chapter {chapterIndex + 1} · Slide {slideIndex + 1} of {chapterSlidesCount}
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBookmarkToggle} className="shrink-0">
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            {renderContent(displayContent)}
          </div>

          {/* Completion Checkbox */}
          <div className="mt-2 flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
            <Checkbox id={`slide-${slideId}`} checked={isCompleted} onCheckedChange={handleCompletionChange} className="h-5 w-5" />
            <label htmlFor={`slide-${slideId}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              Mark as completed
            </label>
            {isCompleted && <div className="flex items-center text-xs text-muted-foreground ml-2">
                <Clock className="h-3 w-3 mr-1" />
                Completed
              </div>}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-3">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={onPrevChapter} disabled={chapterIndex === 0}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onPrevSlide} disabled={chapterIndex === 0 && slideIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={onNextSlide} disabled={chapterIndex === totalChapters - 1 && slideIndex === chapterSlidesCount - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNextChapter} disabled={chapterIndex === totalChapters - 1}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>;
};
export default EnhancedSlideContent;
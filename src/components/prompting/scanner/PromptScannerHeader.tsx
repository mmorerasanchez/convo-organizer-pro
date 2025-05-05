
import React from 'react';
import { TokenUsageDisplay } from '../designer/TokenUsageDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PromptScannerHeaderProps {
  title: string;
  currentUsage: number;
  limit: number;
  apiError: string | null;
}

export function PromptScannerHeader({
  title,
  currentUsage,
  limit,
  apiError
}: PromptScannerHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <TokenUsageDisplay currentUsage={currentUsage} limit={limit} />
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="rounded-lg border shadow-sm">
          <AlertDescription>
            {apiError.includes("quota") 
              ? "OpenAI API quota exceeded. The service is temporarily unavailable. Please try again later."
              : apiError.includes("internet") || apiError.includes("connection") 
                ? "Error: Please make sure you have an active internet connection and try again."
                : `Error: ${apiError}. Please try again later.`
            }
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

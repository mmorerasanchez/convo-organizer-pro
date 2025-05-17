
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ value, onChange }) => {
  const platformOptions = [
    { value: 'ChatGPT', label: 'ChatGPT' },
    { value: 'Claude', label: 'Claude' },
    { value: 'Gemini', label: 'Gemini' },
    { value: 'Multiple', label: 'Multiple' },
    { value: 'Lovable', label: 'Lovable' },
    { value: 'Replit', label: 'Replit' },
    { value: 'DeepSeek', label: 'DeepSeek' },
    { value: 'Mistral', label: 'Mistral' },
    { value: 'Perplexity', label: 'Perplexity' }
  ];
  
  return (
    <div className="space-y-2">
      <Label htmlFor="platform">Platform</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="platform">
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {platformOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

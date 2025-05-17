
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConversationTypeSelectorProps {
  value: 'input' | 'output';
  onChange: (value: 'input' | 'output') => void;
}

export const ConversationTypeSelector: React.FC<ConversationTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Type</Label>
      <Select 
        value={value} 
        onValueChange={(value: 'input' | 'output') => onChange(value)}
      >
        <SelectTrigger id="type">
          <SelectValue placeholder="Conversation type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="input">Input</SelectItem>
          <SelectItem value="output">Output</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

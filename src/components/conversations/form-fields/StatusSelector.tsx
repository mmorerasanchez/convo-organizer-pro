
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Conversation status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Final">Final</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

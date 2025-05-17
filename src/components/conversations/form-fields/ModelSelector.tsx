
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIModel } from '@/lib/types';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  models: AIModel[];
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, models }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="model">
          <SelectValue placeholder="Select AI model (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {models.map((model: AIModel) => (
            <SelectItem key={model.id} value={model.id}>
              {model.displayName} ({model.provider})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

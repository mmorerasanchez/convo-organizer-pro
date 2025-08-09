import React from 'react';
import { Book, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewKnowledgeDialog from './NewKnowledgeDialog';
interface KnowledgeEmptyStateProps {
  projectId: string;
}
const KnowledgeEmptyState: React.FC<KnowledgeEmptyStateProps> = ({
  projectId
}) => {
  return;
};
export default KnowledgeEmptyState;
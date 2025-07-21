
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className }) => {
  const getStatusVariant = () => {
    switch (status) {
      case 'not started':
        return 'muted';
      case 'in progress':
        return 'info';
      case 'active':
        return 'success';
      default:
        return 'muted';
    }
  };

  return (
    <Badge variant={getStatusVariant()} className={className}>
      {status}
    </Badge>
  );
};

export default ProjectStatusBadge;

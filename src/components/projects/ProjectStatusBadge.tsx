
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'not started':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-medium ${getStatusColor()} ${className || ''}`}>
      {status}
    </Badge>
  );
};

export default ProjectStatusBadge;

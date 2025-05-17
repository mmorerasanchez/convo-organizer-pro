
import React from 'react';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProjectStatusBadge from './ProjectStatusBadge';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ProjectsTableViewProps {
  projects: Project[];
  isLoading: boolean;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  sortDirection?: 'asc' | 'desc';
  setSortDirection?: (value: 'asc' | 'desc') => void;
}

const ProjectsTableView: React.FC<ProjectsTableViewProps> = ({
  projects,
  isLoading,
  sortBy,
  setSortBy
}) => {
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const handleSortChange = (column: 'updated' | 'name') => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to descending
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: 'updated' | 'name') => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer font-medium"
              onClick={() => handleSortChange('name')}
            >
              <div className="flex items-center">
                Name {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Conversations</TableHead>
            <TableHead 
              className="cursor-pointer font-medium"
              onClick={() => handleSortChange('updated')}
            >
              <div className="flex items-center">
                Updated {getSortIcon('updated')}
              </div>
            </TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-muted/40">
              <TableCell>
                <Link 
                  to={`/projects/${project.id}`} 
                  className="font-semibold text-primary hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                {project.conversationCount}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTableView;


import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Files, Users } from 'lucide-react';
import StatusIndicator from '@/components/common/StatusIndicator';

interface ProjectCardProps {
  project: Project;
  isShared?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isShared = false }) => {
  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className="h-full projects-card hover:shadow-md transition-all duration-200 border-muted/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl font-semibold truncate leading-tight flex-1 min-w-0">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isShared && (
                <Users size={16} className="text-primary" aria-label="Shared Project" />
              )}
              <StatusIndicator status={project.status} />
            </div>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description || "No description provided"}
            </p>
          )}
        </CardHeader>
        <CardFooter className="bg-muted/10 border-t px-5 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageCircle size={12} />
              <span>{project.conversationCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Files size={12} />
              <span>0</span>
            </div>
          </div>
          <div>
            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;

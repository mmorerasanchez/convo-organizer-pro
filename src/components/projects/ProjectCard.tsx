
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Folder, MessageCircle, Users } from 'lucide-react';
import StatusIndicator from '@/components/common/StatusIndicator';

interface ProjectCardProps {
  project: Project;
  isShared?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isShared = false }) => {
  // Extract the emoji from the project name if it exists
  const hasEmoji = project.name.match(/^(\p{Emoji}|[\u{1F300}-\u{1F6FF}])\s/u);
  const emoji = hasEmoji ? hasEmoji[0].trim() : null;
  const displayName = hasEmoji ? project.name.replace(hasEmoji[0], '') : project.name;

  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className="h-full projects-card hover:shadow-md transition-all duration-200 border-muted/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 rounded-md p-2 flex-shrink-0">
              {emoji ? (
                <span className="text-xl">{emoji}</span>
              ) : (
                <Folder className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-xl font-semibold truncate leading-tight">{displayName}</CardTitle>
                {isShared && (
                  <Users size={16} className="text-primary flex-shrink-0 ml-2" aria-label="Shared Project" />
                )}
              </div>
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
          <div className="flex items-center gap-1">
            <MessageCircle size={12} />
            <span>{project.conversationCount}</span>
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


import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users } from 'lucide-react';

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
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full hover:shadow-md transition-all duration-200">
        <CardContent className="pt-6">
          <div className="mb-2 text-xl font-semibold flex items-center justify-between">
            <span className="flex items-center">
              {emoji && <span className="mr-2 text-2xl">{emoji}</span>}
              {displayName}
            </span>
            {isShared && (
              <Users size={18} className="text-primary" title="Shared Project" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {project.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{project.conversationCount} conversations</span>
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

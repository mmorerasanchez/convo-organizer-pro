
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full convo-card">
        <CardContent className="pt-6">
          <div className="mb-2 text-xl font-semibold">{project.name}</div>
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

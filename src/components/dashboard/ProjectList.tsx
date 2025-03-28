
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your recently updated projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.slice(0, 4).map((project) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="block"
              >
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No projects found
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Link 
            to="/projects" 
            className="text-sm text-primary hover:underline"
          >
            View all projects
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectList;

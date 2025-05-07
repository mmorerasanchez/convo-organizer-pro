
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Recent Projects</CardTitle>
            <CardDescription>Your recently updated projects</CardDescription>
          </div>
          <Link to="/projects">
            <Button variant="ghost" size="sm" className="text-primary h-8 text-sm">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projects.length > 0 ? (
            projects.slice(0, 4).map((project) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="block"
              >
                <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                  <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Folder size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-sm">{project.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="text-xs text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </div>
                      <div className="text-xs flex items-center gap-1 text-muted-foreground">
                        <BookOpen size={12} />
                        {project.conversationCount}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No projects found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectList;

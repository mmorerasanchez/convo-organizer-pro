
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Share, Trash, Users, ArrowLeft } from 'lucide-react';
import { Project } from '@/lib/types';
import ProjectShareDialog from './ProjectShareDialog';
import EditProjectDialog from './EditProjectDialog';
import DeleteDialog from '@/components/common/DeleteDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@/lib/api';
import { toast } from 'sonner';

interface ProjectDetailHeaderProps {
  project: Project;
  isShared?: boolean;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project, isShared = false }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project "${project.name}" deleted`);
      navigate('/projects');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting project: ${error.message}`);
    }
  });
  
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {isShared && <Users className="h-5 w-5 text-primary" aria-label="Shared Project" />}
          </div>
        </div>
        
        {!isShared && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground">{project.description}</p>
      
      {showShareDialog && (
        <ProjectShareDialog 
          project={project}
          trigger={undefined}
        />
      )}
      
      {showEditDialog && (
        <EditProjectDialog 
          project={project} 
          trigger={undefined}
        />
      )}
      
      {showDeleteDialog && (
        <DeleteDialog
          itemType="project"
          itemName={project.name}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          trigger={undefined}
        />
      )}
    </div>
  );
};

export default ProjectDetailHeader;

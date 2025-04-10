
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash, Share, Users } from 'lucide-react';
import EditProjectDialog from './EditProjectDialog';
import DeleteDialog from '@/components/common/DeleteDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProjectShareDialog from './ProjectShareDialog';

interface ProjectDetailHeaderProps {
  project: Project;
  isShared?: boolean;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project, isShared = false }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting project: ${error.message}`);
    }
  });
  
  const handleDelete = () => {
    deleteMutation.mutate(project.id);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" as={Link} to="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {isShared && <Users className="h-5 w-5 text-primary" title="Shared Project" />}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ProjectShareDialog project={project} />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      {project.description && (
        <p className="text-muted-foreground">{project.description}</p>
      )}
      
      {showEditDialog && (
        <EditProjectDialog 
          project={project} 
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
      
      {showDeleteDialog && (
        <DeleteDialog
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone and all project data, including conversations and knowledge, will be permanently deleted."
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default ProjectDetailHeader;

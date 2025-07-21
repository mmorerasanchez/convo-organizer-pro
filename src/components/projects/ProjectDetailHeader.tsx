
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Share, Trash, Users, ArrowLeft, Brain, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Project } from '@/lib/types';
import ProjectShareDialog from './ProjectShareDialog';
import EditProjectDialog from './EditProjectDialog';
import DeleteDialog from '@/components/common/DeleteDialog';
import { ProjectContextDisplay } from './ProjectContextDisplay';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteProject } from '@/lib/api';
import { getProjectContext, updateProjectContext, getProjectLearningJobs } from '@/lib/api/projectContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  // Fetch project context
  const { data: projectContext, isLoading: isContextLoading } = useQuery({
    queryKey: ['projectContext', project.id],
    queryFn: () => getProjectContext(project.id),
    enabled: !!project.id
  });

  // Fetch learning jobs
  const { data: learningJobs = [] } = useQuery({
    queryKey: ['learningJobs', project.id],
    queryFn: () => getProjectLearningJobs(project.id),
    enabled: !!project.id
  });

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

  const updateContextMutation = useMutation({
    mutationFn: () => updateProjectContext(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectContext', project.id] });
      queryClient.invalidateQueries({ queryKey: ['learningJobs', project.id] });
      toast.success('Project context updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating context: ${error.message}`);
    }
  });
  
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleUpdateContext = () => {
    updateContextMutation.mutate();
  };

  const lastLearningJob = learningJobs[0];
  const isLearning = lastLearningJob?.status === 'processing' || updateContextMutation.isPending;

  // Calculate context freshness
  const getContextFreshness = () => {
    if (!project.last_learning_run) return null;
    
    const lastUpdate = new Date(project.last_learning_run);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    const isStale = daysSince > 30;
    
    return {
      daysSince,
      isStale,
      lastUpdate,
      label: formatDistanceToNow(lastUpdate, { addSuffix: true })
    };
  };

  const contextFreshness = getContextFreshness();

  return (
    <div className="space-y-6">
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
            {/* Context Freshness Indicator */}
            {contextFreshness && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {contextFreshness.isStale ? (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      <span>{contextFreshness.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Context last updated {contextFreshness.label}</p>
                    <p className="text-xs">
                      {contextFreshness.isStale ? 'Context may be outdated' : 'Context is fresh'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Generate Context Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleUpdateContext}
              disabled={isLearning}
            >
              {isLearning ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                  Learning...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Context
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 opacity-60 cursor-not-allowed"
              disabled
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            <EditProjectDialog 
              project={project} 
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              }
            />
            
            <DeleteDialog 
              itemType="project"
              itemName={project.name}
              trigger={
                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:bg-red-50">
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              }
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground">{project.description}</p>
      
      {/* AI Context Display - Remove the update button since it's now in the header */}
      <ProjectContextDisplay
        projectId={project.id}
        context={projectContext}
        lastLearningJob={lastLearningJob}
        isLearning={isLearning}
        onUpdateContext={undefined} // Remove the button from here
      />
      
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

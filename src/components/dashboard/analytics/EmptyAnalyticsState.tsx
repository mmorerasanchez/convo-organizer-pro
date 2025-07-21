
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MessageCircle, FolderOpen, FileText, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create Your First Project',
      description: 'Start organizing your AI conversations and knowledge',
      icon: <FolderOpen className="h-5 w-5" />,
      action: () => navigate('/projects'),
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Add a Conversation',
      description: 'Import your AI conversations to track progress',
      icon: <MessageCircle className="h-5 w-5" />,
      action: () => navigate('/conversations'),
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Upload Knowledge Files',
      description: 'Build your knowledge base with documents and files',
      icon: <FileText className="h-5 w-5" />,
      action: () => navigate('/projects'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-2xl mx-auto text-center space-y-6 p-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">No Analytics Data Yet</h2>
          <p className="text-muted-foreground text-lg">
            Start building your AI workflow to see powerful insights and analytics here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {quickActions.map((action, index) => (
            <Card key={index} className={`cursor-pointer hover:shadow-md transition-all ${action.color} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center mb-2">
                  {action.icon}
                </div>
                <CardTitle className="text-sm font-medium text-center">
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-center mb-3 opacity-80">
                  {action.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={action.action}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Pro Tip</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Once you start creating projects and conversations, you'll see detailed analytics including 
            project status distribution, platform usage, activity timelines, and knowledge insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyAnalyticsState;

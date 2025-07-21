
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, MessageCircle, Settings, TrendingUp } from 'lucide-react';

interface KPI {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface AnalyticsKPIsProps {
  projectCount: number;
  conversationCount: number;
  knowledgeCount: number;
  toolsCount: number;
  avgQualityScore: number;
}

const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({
  projectCount,
  conversationCount,
  knowledgeCount,
  toolsCount,
  avgQualityScore
}) => {
  const kpis: KPI[] = [
    {
      title: 'Total Projects',
      value: projectCount,
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: 'Conversations',
      value: conversationCount,
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      title: 'Knowledge Files',
      value: knowledgeCount,
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: 'Tools Created',
      value: toolsCount,
      icon: <Settings className="h-4 w-4" />
    },
    {
      title: 'Avg Quality Score',
      value: avgQualityScore.toFixed(1),
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.change && (
              <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsKPIs;

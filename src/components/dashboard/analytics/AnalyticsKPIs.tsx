
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, MessageCircle, Settings, TrendingUp, Clock } from 'lucide-react';

interface KPI {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
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
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  const kpis: KPI[] = [
    {
      title: 'Total Projects',
      value: formatValue(projectCount),
      icon: <Activity className="h-4 w-4" />,
      description: 'Active projects in your workspace'
    },
    {
      title: 'Conversations',
      value: formatValue(conversationCount),
      icon: <MessageCircle className="h-4 w-4" />,
      description: 'AI conversations captured'
    },
    {
      title: 'Knowledge Files',
      value: formatValue(knowledgeCount),
      icon: <FileText className="h-4 w-4" />,
      description: 'Documents and files uploaded'
    },
    {
      title: 'Tools Created',
      value: formatValue(toolsCount),
      icon: <Settings className="h-4 w-4" />,
      description: 'Custom AI tools built'
    },
    {
      title: 'Avg Quality Score',
      value: avgQualityScore > 0 ? avgQualityScore.toFixed(1) : '—',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Overall project quality rating'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-xl sm:text-2xl font-bold leading-none">
              {kpi.value}
            </div>
            {kpi.description && (
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {kpi.description}
              </p>
            )}
            {kpi.change && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-700' :
                  kpi.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {kpi.change}
                </span>
              </div>
            )}
          </CardContent>
          <div className="absolute bottom-0 right-0 opacity-5">
            <Clock className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsKPIs;

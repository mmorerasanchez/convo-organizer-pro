
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Calendar } from 'lucide-react';

interface ActivityTimelineChartProps {
  data: Array<{ date: string; conversations: number; projects: number; total: number }>;
  lastUpdated?: string;
}

const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({ 
  data, 
  lastUpdated 
}) => {
  const chartConfig = {
    conversations: {
      label: "Conversations",
      color: "hsl(var(--chart-1))",
    },
    projects: {
      label: "Projects",
      color: "hsl(var(--chart-2))",
    },
  };

  const getActivityInsight = () => {
    if (!data || data.length === 0) return "No recent activity";
    
    const recentActivity = data.slice(-7);
    const totalActivity = recentActivity.reduce((sum, day) => sum + day.total, 0);
    const avgDailyActivity = (totalActivity / recentActivity.length).toFixed(1);
    
    const lastWeekActivity = data.slice(-14, -7).reduce((sum, day) => sum + day.total, 0);
    const thisWeekActivity = recentActivity.reduce((sum, day) => sum + day.total, 0);
    
    if (lastWeekActivity === 0) return `${avgDailyActivity} avg daily activities this week`;
    
    const percentChange = ((thisWeekActivity - lastWeekActivity) / lastWeekActivity * 100).toFixed(0);
    const trend = Number(percentChange) > 0 ? '↗️' : Number(percentChange) < 0 ? '↘️' : '→';
    
    return `${trend} ${Math.abs(Number(percentChange))}% vs last week • ${avgDailyActivity} daily avg`;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Daily activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 md:h-56 lg:h-64">
          <div className="text-center space-y-2">
            <Activity className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No activity data available</p>
            <p className="text-xs text-muted-foreground">Activity will appear as you work with projects and conversations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
          <CardDescription className="text-sm">
            {getActivityInsight()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 md:h-56 lg:h-64 w-full">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Line
              type="monotone"
              dataKey="conversations"
              stroke="var(--color-conversations)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="projects"
              stroke="var(--color-projects)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />} 
            />
          </LineChart>
        </ChartContainer>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Last 30 days</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Real-time updates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineChart;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';

interface ProjectStatusChartProps {
  data: Record<string, number>;
  lastUpdated?: string;
  totalProjects?: number;
}

const COLORS = {
  'not started': 'hsl(var(--muted))',
  'in progress': 'hsl(var(--chart-primary))',
  'active': 'hsl(var(--chart-1))',
  'completed': 'hsl(var(--chart-2))',
  'on hold': 'hsl(var(--chart-3))'
};

const STATUS_LABELS = {
  'not started': 'Not Started',
  'in progress': 'In Progress', 
  'active': 'Active',
  'completed': 'Completed',
  'on hold': 'On Hold'
};

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ 
  data, 
  lastUpdated,
  totalProjects = 0 
}) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    status: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status.replace('_', ' '),
    count,
    percentage: totalProjects > 0 ? ((count / totalProjects) * 100).toFixed(1) : '0',
    fill: COLORS[status as keyof typeof COLORS] || 'hsl(var(--muted))'
  }));

  const chartConfig = {
    count: {
      label: "Projects",
    },
  };

  const getStatusInsight = () => {
    const activeCount = (data['active'] || 0) + (data['in progress'] || 0);
    const completedCount = data['completed'] || 0;
    const totalActive = activeCount + completedCount;
    
    if (totalActive === 0) return "No projects tracked yet";
    if (completedCount > activeCount) return "Great progress! More projects completed than active";
    if (activeCount > 0) return `${activeCount} projects currently active`;
    return "Project distribution overview";
  };

  if (totalProjects === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Breakdown of projects by current status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 md:h-56 lg:h-64">
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No projects to display</p>
            <p className="text-xs text-muted-foreground">Create your first project to see status breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">Project Status Distribution</CardTitle>
          <CardDescription className="text-sm">
            {getStatusInsight()} • {totalProjects} total projects
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 md:h-56 lg:h-64 w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="40%"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name) => [
                  `${value} projects (${chartData.find(d => d.status === name)?.percentage}%)`,
                  name
                ]}
              />} 
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProjectStatusChartProps {
  data: Record<string, number>;
}

const COLORS = {
  'not started': 'hsl(var(--muted))',
  'in progress': 'hsl(var(--primary))',
  'active': 'hsl(var(--chart-1))',
  'completed': 'hsl(var(--chart-2))',
  'on hold': 'hsl(var(--chart-3))'
};

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    status: status.replace('_', ' '),
    count,
    fill: COLORS[status as keyof typeof COLORS] || 'hsl(var(--muted))'
  }));

  const chartConfig = {
    count: {
      label: "Projects",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
        <CardDescription>Breakdown of projects by current status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;

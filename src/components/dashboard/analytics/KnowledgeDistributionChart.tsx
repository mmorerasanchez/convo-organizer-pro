
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface KnowledgeDistributionChartProps {
  data: Record<string, number>;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

const KnowledgeDistributionChart: React.FC<KnowledgeDistributionChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([fileType, count], index) => ({
    fileType,
    count,
    fill: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    count: {
      label: "Files",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge File Types</CardTitle>
        <CardDescription>Distribution of uploaded file types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="fileType"
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

export default KnowledgeDistributionChart;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PlatformUsageChartProps {
  data: Record<string, number>;
}

const PlatformUsageChart: React.FC<PlatformUsageChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([platform, count]) => ({
    platform,
    count
  }));

  const chartConfig = {
    count: {
      label: "Conversations",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Usage</CardTitle>
        <CardDescription>Conversations by AI platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={chartData}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformUsageChart;

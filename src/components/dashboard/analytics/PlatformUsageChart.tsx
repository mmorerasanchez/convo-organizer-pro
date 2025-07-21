
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, MessageCircle, TrendingUp } from 'lucide-react';

interface PlatformUsageChartProps {
  data: Record<string, number>;
  lastUpdated?: string;
  totalConversations?: number;
}

const PlatformUsageChart: React.FC<PlatformUsageChartProps> = ({ 
  data, 
  lastUpdated,
  totalConversations = 0 
}) => {
  const chartData = Object.entries(data)
    .map(([platform, count]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      count,
      percentage: totalConversations > 0 ? ((count / totalConversations) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.count - a.count);

  const chartConfig = {
    count: {
      label: "Conversations",
      color: "hsl(var(--chart-1))",
    },
  };

  const getMostUsedPlatform = () => {
    if (chartData.length === 0) return null;
    const topPlatform = chartData[0];
    return `${topPlatform.platform} leads with ${topPlatform.percentage}% of conversations`;
  };

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (totalConversations === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
          <CardDescription>Conversations by AI platform</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 md:h-56 lg:h-64">
          <div className="text-center space-y-2">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No conversations to display</p>
            <p className="text-xs text-muted-foreground">Start adding conversations to see platform usage</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Platform Usage</CardTitle>
            <CardDescription className="text-sm">
              {getMostUsedPlatform() || 'Conversations by AI platform'} • {totalConversations} total
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatLastUpdated(lastUpdated)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 md:h-56 lg:h-64 w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="platform" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Bar 
              dataKey="count" 
              fill="var(--color-count)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name) => [
                  `${value} conversations (${chartData.find(d => d.count === value)?.percentage}%)`,
                  'Conversations'
                ]}
              />} 
            />
          </BarChart>
        </ChartContainer>
        {chartData.length > 0 && (
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Top platform: {chartData[0].platform} ({chartData[0].count} conversations)</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformUsageChart;

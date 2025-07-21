
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FileText, HardDrive } from 'lucide-react';

interface KnowledgeDistributionChartProps {
  data: Record<string, number>;
  lastUpdated?: string;
  totalFiles?: number;
  totalSize?: number;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

const FILE_TYPE_LABELS = {
  'pdf': 'PDF Documents',
  'txt': 'Text Files',
  'md': 'Markdown',
  'doc': 'Word Documents',
  'docx': 'Word Documents',
  'png': 'Images',
  'jpg': 'Images',
  'jpeg': 'Images',
  'json': 'JSON Files',
  'csv': 'Spreadsheets',
  'xlsx': 'Spreadsheets'
};

const KnowledgeDistributionChart: React.FC<KnowledgeDistributionChartProps> = ({ 
  data, 
  lastUpdated,
  totalFiles = 0,
  totalSize = 0 
}) => {
  const chartData = Object.entries(data).map(([fileType, count], index) => ({
    fileType: FILE_TYPE_LABELS[fileType as keyof typeof FILE_TYPE_LABELS] || fileType.toUpperCase(),
    originalType: fileType,
    count,
    percentage: totalFiles > 0 ? ((count / totalFiles) * 100).toFixed(1) : '0',
    fill: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    count: {
      label: "Files",
    },
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getMostCommonType = () => {
    if (chartData.length === 0) return null;
    const topType = chartData.reduce((max, current) => 
      current.count > max.count ? current : max
    );
    return `${topType.fileType} (${topType.percentage}%)`;
  };

  if (totalFiles === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Knowledge File Types</CardTitle>
          <CardDescription>Distribution of uploaded file types</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 md:h-56 lg:h-64">
          <div className="text-center space-y-2">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No knowledge files uploaded</p>
            <p className="text-xs text-muted-foreground">Upload documents to see file type distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">Knowledge File Types</CardTitle>
          <CardDescription className="text-sm">
            {getMostCommonType() ? `Most common: ${getMostCommonType()}` : 'Distribution of uploaded file types'} • {totalFiles} files
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 md:h-56 lg:h-64 w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="fileType"
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
                  `${value} files (${chartData.find(d => d.fileType === name)?.percentage}%)`,
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
        {totalSize > 0 && (
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>Total size: {formatFileSize(totalSize)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Avg: {formatFileSize(totalSize / totalFiles)}/file</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeDistributionChart;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MetricsBarChartProps {
  metrics: {
    name: string;
    score: number;
    weight: number;
  }[];
  className?: string;
}

const MetricsBarChart: React.FC<MetricsBarChartProps> = ({ metrics, className = '' }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">Score: {payload[0].value.toFixed(1)}</p>
          <p className="text-purple-500">Weight: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`h-full animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Metric Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12 }} 
              tickMargin={8}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#6366F1" />
            <YAxis yAxisId="right" orientation="right" stroke="#A855F7" />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="score" fill="#6366F1" name="Score" radius={[4, 4, 0, 0]} barSize={25} />
            <Bar yAxisId="right" dataKey="weight" fill="#A855F7" name="Weight %" radius={[4, 4, 0, 0]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MetricsBarChart;

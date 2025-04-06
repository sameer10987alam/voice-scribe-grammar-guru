
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ScoreMetricsChartProps {
  metrics: Array<{
    name: string;
    score: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm text-xs">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">{`Score: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const ScoreMetricsChart: React.FC<ScoreMetricsChartProps> = ({ metrics }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Grammar Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar 
                dataKey="score" 
                fill="rgba(59, 130, 246, 0.9)" 
                radius={[4, 4, 0, 0]} 
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreMetricsChart;

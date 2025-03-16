
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StartupListItem } from './StartupList';

export interface ScoreCardMetric {
  criteria: string;
  value: string | number;
  importance: 'Low' | 'Medium' | 'High' | 'Very High';
  score: number;
}

interface ScoreCardProps {
  startupName: string;
  sector: string;
  metrics: ScoreCardMetric[];
  overallScore: number;
  className?: string;
  startupData?: StartupListItem;
}

const importanceColor = {
  'Low': 'text-slate-500',
  'Medium': 'text-blue-500',
  'High': 'text-purple-500',
  'Very High': 'text-orange-500'
};

const ScoreCard: React.FC<ScoreCardProps> = ({
  startupName,
  sector,
  metrics,
  overallScore,
  className = '',
  startupData
}) => {
  // Generate dynamic metrics from the startup's original data if available
  const dynamicMetrics: ScoreCardMetric[] = [];
  
  if (startupData?.originalData) {
    // Define importance based on standard fields we recognize
    const importanceMap: Record<string, 'Low' | 'Medium' | 'High' | 'Very High'> = {
      'monthly visits': 'Medium',
      'last funding': 'High',
      'funding': 'High',
      'valuation': 'High',
      'cagr': 'Very High',
      'growth': 'Very High',
      'market size': 'Medium',
      'revenue': 'High',
    };
    
    // Used to determine dynamic score out of 10 for each metric
    const normalizeValue = (key: string, value: string): number => {
      const numValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
      
      if (numValue === 0) return 0;
      
      if (key.includes('monthly visit')) {
        return Math.min(Math.round(numValue / 50000), 10);
      } else if (key.includes('funding')) {
        return Math.min(Math.round(numValue / 10000000), 10);
      } else if (key.includes('valuation')) {
        return Math.min(Math.round(numValue / 50000000), 10);
      } else if (key.includes('cagr') || key.includes('growth')) {
        return Math.min(Math.round(numValue / 5), 10);
      }
      
      // Default normalization for unknown metrics
      return Math.min(Math.round(numValue / 10), 10);
    };
    
    // Create metrics from original data, excluding name and sector
    Object.entries(startupData.originalData).forEach(([key, value]) => {
      if (!key.includes('name') && !key.includes('startup') && !key.includes('sector') && !key.includes('industry')) {
        let importance: 'Low' | 'Medium' | 'High' | 'Very High' = 'Medium';
        
        // Determine importance based on key matching
        for (const [pattern, level] of Object.entries(importanceMap)) {
          if (key.toLowerCase().includes(pattern)) {
            importance = level;
            break;
          }
        }
        
        dynamicMetrics.push({
          criteria: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          value: value,
          importance: importance,
          score: normalizeValue(key.toLowerCase(), value)
        });
      }
    });
  }

  // Use dynamically generated metrics if available, otherwise use provided metrics
  const displayMetrics = dynamicMetrics.length > 0 ? dynamicMetrics : metrics;

  return (
    <Card className={`overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in ${className}`}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{startupName}</h3>
        <p className="text-slate-500 dark:text-slate-400">Sector: {sector}</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Criteria</TableHead>
              <TableHead className="min-w-[300px]">Value</TableHead>
              <TableHead className="w-[120px]">Importance</TableHead>
              <TableHead className="w-[120px] text-right">Score (out of 10)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayMetrics.map((metric, index) => (
              <TableRow key={index} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <TableCell className="font-medium">{metric.criteria}</TableCell>
                <TableCell>{metric.value}</TableCell>
                <TableCell className={importanceColor[metric.importance]}>
                  {metric.importance}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress value={metric.score * 10} className="w-16 h-2" />
                    <span className="font-mono">{metric.score}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-50 dark:bg-slate-800/50 font-medium">
              <TableCell>Overall Rating</TableCell>
              <TableCell colSpan={2}>Based on scoring model</TableCell>
              <TableCell className="text-right font-bold">{overallScore}/10</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ScoreCard;

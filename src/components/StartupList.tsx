
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from 'lucide-react';

export interface StartupListItem {
  id: string;
  name: string;
  sector: string;
  score: number;
  monthlyVisits: number;
  lastFunding: number;
  valuation: number;
  cagr: number;
  missingFields?: string[];
  originalData?: Record<string, string>;
}

interface StartupListProps {
  startups: StartupListItem[];
  onStartupSelect: (startupId: string) => void;
  selectedStartupId?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num}`;
};

const StartupList: React.FC<StartupListProps> = ({
  startups,
  onStartupSelect,
  selectedStartupId
}) => {
  return (
    <div className="space-y-3">
      {startups.map((startup) => (
        <Card 
          key={startup.id}
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedStartupId === startup.id 
              ? 'border-primary ring-1 ring-primary/20' 
              : 'border-slate-200 dark:border-slate-700'
          }`}
          onClick={() => onStartupSelect(startup.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <CardTitle className="font-medium">{startup.name}</CardTitle>
                  {startup.missingFields && startup.missingFields.length > 0 && (
                    <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      MD ({startup.missingFields.length})
                    </Badge>
                  )}
                </div>
                <CardDescription>{startup.sector}</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1">
                Score: {startup.score.toFixed(1)}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Monthly Visits</p>
                <p className="font-medium flex items-center">
                  {startup.monthlyVisits.toLocaleString()}
                  {startup.missingFields?.includes('monthlyVisits') && (
                    <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Last Funding</p>
                <p className="font-medium flex items-center">
                  {formatNumber(startup.lastFunding)}
                  {startup.missingFields?.includes('lastFunding') && (
                    <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Valuation</p>
                <p className="font-medium flex items-center">
                  {formatNumber(startup.valuation)}
                  {startup.missingFields?.includes('valuation') && (
                    <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">CAGR</p>
                <p className="font-medium flex items-center">
                  {startup.cagr}%
                  {startup.missingFields?.includes('cagr') && (
                    <CheckCircle2 className="h-3 w-3 ml-1 text-green-500" />
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StartupList;

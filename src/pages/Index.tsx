
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ScoreCard, { ScoreCardMetric } from '@/components/ScoreCard';
import ChatInterface from '@/components/ChatInterface';
import SectorSelect from '@/components/SectorSelect';
import StartupList, { StartupListItem } from '@/components/StartupList';
import MetricsBarChart from '@/components/MetricsBarChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Users, DollarSign, BarChart4 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data - would be replaced with actual data loading logic
const sampleSectors = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce'];

const sampleStartups: StartupListItem[] = [
  {
    id: '1',
    name: 'TechPro Analytics',
    sector: 'SaaS',
    score: 8.5,
    monthlyVisits: 125000,
    lastFunding: 30000000,
    valuation: 150000000,
    cagr: 35
  },
  {
    id: '2',
    name: 'FinEdge',
    sector: 'FinTech',
    score: 9.2,
    monthlyVisits: 200000,
    lastFunding: 45000000,
    valuation: 220000000,
    cagr: 42
  },
  {
    id: '3',
    name: 'MediSync',
    sector: 'HealthTech',
    score: 7.8,
    monthlyVisits: 95000,
    lastFunding: 25000000,
    valuation: 120000000,
    cagr: 28
  }
];

const sampleMetrics: ScoreCardMetric[] = [
  { criteria: 'Monthly Visits', value: '125K visitors', importance: 'Medium', score: 8 },
  { criteria: 'Last Funding / Total Funding', value: '$30M in Series C', importance: 'High', score: 9 },
  { criteria: 'Valuation / Total Funding', value: '$150M / $45M', importance: 'High', score: 9 },
  { criteria: 'CAGR', value: '35%', importance: 'Very High', score: 8 },
  { criteria: 'Current Market Size', value: '$15B market', importance: 'Medium', score: 7 },
  { criteria: 'Total VC Score', value: 'Top 5 sector performer', importance: 'High', score: 8 },
  { criteria: 'Number of Funding Rounds', value: '3 rounds', importance: 'Medium', score: 7 },
  { criteria: 'Revenue Growth', value: '3x YoY growth', importance: 'Very High', score: 9 },
];

const sampleMetricsChart = [
  { name: 'Monthly Visits', score: 8, weight: 10 },
  { name: 'Last Funding', score: 9, weight: 10 },
  { name: 'Valuation', score: 9, weight: 15 },
  { name: 'CAGR', score: 8, weight: 10 },
  { name: 'Market Size', score: 7, weight: 10 },
  { name: 'VC Score', score: 8, weight: 15 },
  { name: 'Funding Rounds', score: 7, weight: 5 },
  { name: 'Revenue Growth', score: 9, weight: 10 },
];

const Index: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStartupId, setSelectedStartupId] = useState<string | undefined>('1');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

  const handleQuery = (query: string) => {
    console.log('Processing query:', query);
    setIsProcessingQuery(true);
    
    // Simulate query processing
    setTimeout(() => {
      setIsProcessingQuery(false);
    }, 2000);
  };

  const filteredStartups = selectedSector === 'all'
    ? sampleStartups
    : sampleStartups.filter(startup => startup.sector === selectedSector);

  const selectedStartup = sampleStartups.find(startup => startup.id === selectedStartupId);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-blur-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Startup Scorecard Genius</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              AI-powered analysis and scoring of startup performance
            </p>
          </div>
          <SectorSelect 
            sectors={sampleSectors}
            selectedSector={selectedSector}
            onChange={setSelectedSector}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="transition-all hover:shadow-md animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Top Rated Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">FinTech</div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <TrendingUp className="mr-1 h-3 w-3" /> 9.2/10
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md animate-slide-up" style={{ animationDelay: '50ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Most Visited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">FinEdge</div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  <Users className="mr-1 h-3 w-3" /> 200K
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Highest Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">FinEdge</div>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  <DollarSign className="mr-1 h-3 w-3" /> $220M
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md animate-slide-up" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Best Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">FinEdge</div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                  <BarChart4 className="mr-1 h-3 w-3" /> 42% CAGR
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="scorecard">
              <TabsList className="mb-4">
                <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scorecard" className="mt-0">
                {selectedStartup && (
                  <ScoreCard
                    startupName={selectedStartup.name}
                    sector={selectedStartup.sector}
                    metrics={sampleMetrics}
                    overallScore={selectedStartup.score}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="metrics" className="mt-0">
                <MetricsBarChart metrics={sampleMetricsChart} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <span>Top Startups</span>
              <ArrowUpRight className="ml-1 h-4 w-4 text-slate-400" />
            </h2>
            <StartupList
              startups={filteredStartups}
              onStartupSelect={setSelectedStartupId}
              selectedStartupId={selectedStartupId}
            />
          </div>
        </div>

        <div className="h-[400px]">
          <ChatInterface onQuery={handleQuery} isProcessing={isProcessingQuery} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

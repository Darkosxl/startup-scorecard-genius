
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ScoreCard from '@/components/ScoreCard';
import ChatInterface from '@/components/ChatInterface';
import SectorSelect from '@/components/SectorSelect';
import StartupList from '@/components/StartupList';
import MetricsBarChart from '@/components/MetricsBarChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Users, DollarSign, BarChart4 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStartups } from '@/context/StartupsContext';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStartupId, setSelectedStartupId] = useState<string | undefined>();
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const { startups } = useStartups();
  const navigate = useNavigate();

  // If no startups available, set default metrics for the chart
  const [metricsChartData, setMetricsChartData] = useState<{name: string, score: number, weight: number}[]>([]);

  useEffect(() => {
    // Go to upload page if no startups are available
    if (startups.length === 0) {
      const timer = setTimeout(() => {
        navigate('/upload');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Set selected startup to the first one if available and none selected
    if (startups.length > 0 && !selectedStartupId) {
      setSelectedStartupId(startups[0].id);
    }
    
    // Generate metrics chart data from the selected startup
    if (selectedStartupId) {
      const startup = startups.find(s => s.id === selectedStartupId);
      if (startup && startup.originalData) {
        const chartData = Object.entries(startup.originalData)
          .filter(([key]) => !key.includes('name') && !key.includes('startup') && 
                          !key.includes('sector') && !key.includes('industry'))
          .map(([key, value]) => {
            const numValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            let score = 0;
            
            if (key.includes('monthly visit')) {
              score = Math.min(Math.round(numValue / 50000), 10);
            } else if (key.includes('funding')) {
              score = Math.min(Math.round(numValue / 10000000), 10);
            } else if (key.includes('valuation')) {
              score = Math.min(Math.round(numValue / 50000000), 10);
            } else if (key.includes('cagr') || key.includes('growth')) {
              score = Math.min(Math.round(numValue / 5), 10);
            } else {
              score = Math.min(Math.round(numValue / 10), 10);
            }
            
            return {
              name: key.charAt(0).toUpperCase() + key.slice(1),
              score: score,
              weight: 10
            };
          });
        
        setMetricsChartData(chartData);
      }
    }
  }, [startups, selectedStartupId, navigate]);

  const handleQuery = async (query: string) => {
    console.log('Processing query:', query);
    setIsProcessingQuery(true);
    
    // Get API key from local storage (if saved)
    const storedKey = localStorage.getItem('aiApiKey');
    const apiKey = storedKey ? atob(storedKey) : null;
    
    if (!apiKey) {
      // Handle missing API key
      setTimeout(() => {
        setIsProcessingQuery(false);
      }, 1000);
      return;
    }
    
    // In a real implementation, this would call the LLM API with the startup data context
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsProcessingQuery(false);
    }, 2000);
  };

  // Filter startups based on sector
  const filteredStartups = selectedSector === 'all'
    ? startups
    : startups.filter(startup => startup.sector === selectedSector);

  // Get unique sectors from data
  const sectors = startups.length > 0 
    ? Array.from(new Set(startups.map(startup => startup.sector))).filter(Boolean)
    : [];

  const selectedStartup = startups.find(startup => startup.id === selectedStartupId);

  // Find key metrics for dashboard tiles
  const topRatedSector = startups.length > 0 
    ? [...startups].sort((a, b) => b.score - a.score)[0]?.sector 
    : 'N/A';
  
  const topRatedScore = startups.length > 0 
    ? [...startups].sort((a, b) => b.score - a.score)[0]?.score.toFixed(1) 
    : '0.0';
  
  const mostVisitedStartup = startups.length > 0 
    ? [...startups].sort((a, b) => b.monthlyVisits - a.monthlyVisits)[0]
    : null;
  
  const highestValuationStartup = startups.length > 0 
    ? [...startups].sort((a, b) => b.valuation - a.valuation)[0]
    : null;
  
  const bestGrowthStartup = startups.length > 0 
    ? [...startups].sort((a, b) => b.cagr - a.cagr)[0]
    : null;

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
          {sectors.length > 0 && (
            <SectorSelect 
              sectors={sectors}
              selectedSector={selectedSector}
              onChange={setSelectedSector}
            />
          )}
        </div>

        {startups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="transition-all hover:shadow-md animate-slide-up">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Top Rated Sector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{topRatedSector}</div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <TrendingUp className="mr-1 h-3 w-3" /> {topRatedScore}/10
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
                    <div className="text-2xl font-bold">{mostVisitedStartup?.name || 'N/A'}</div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      <Users className="mr-1 h-3 w-3" /> {mostVisitedStartup ? (mostVisitedStartup.monthlyVisits / 1000).toFixed(1) + 'K' : 'N/A'}
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
                    <div className="text-2xl font-bold">{highestValuationStartup?.name || 'N/A'}</div>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      <DollarSign className="mr-1 h-3 w-3" /> {highestValuationStartup ? '$' + (highestValuationStartup.valuation / 1000000).toFixed(1) + 'M' : 'N/A'}
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
                    <div className="text-2xl font-bold">{bestGrowthStartup?.name || 'N/A'}</div>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                      <BarChart4 className="mr-1 h-3 w-3" /> {bestGrowthStartup ? bestGrowthStartup.cagr + '% CAGR' : 'N/A'}
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
                        metrics={[]} // Using dynamic metrics from originalData
                        overallScore={selectedStartup.score}
                        startupData={selectedStartup}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="metrics" className="mt-0">
                    <MetricsBarChart metrics={metricsChartData} />
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
          </>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No Startup Data Available</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                You need to upload your startup dataset to get started
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Redirecting to upload page...
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;


import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';
import ScoreCard, { ScoreCardMetric } from '@/components/ScoreCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from 'lucide-react';

// Sample data - would be replaced with actual data loading logic
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

const Search: React.FC = () => {
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  const handleQuery = (query: string) => {
    console.log('Processing query:', query);
    setIsProcessingQuery(true);
    
    // Simulate query processing
    setTimeout(() => {
      setIsProcessingQuery(false);
      // If the query is related to a startup, show its scorecard
      if (query.toLowerCase().includes('techpro') || query.toLowerCase().includes('scorecard')) {
        setShowScorecard(true);
      }
    }, 2000);
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-blur-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Analyze with AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Ask questions about startups, sectors, and generate scorecards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <ChatInterface onQuery={handleQuery} isProcessing={isProcessingQuery} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="transition-all hover:shadow-md animate-slide-up">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    Example Queries
                  </CardTitle>
                  <CardDescription>
                    Try asking these questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Which SaaS startup has the highest growth rate?
                  </Badge>
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Compare TechPro and FinEdge
                  </Badge>
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Create a scorecard for MediSync
                  </Badge>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md animate-slide-up" style={{ animationDelay: '50ms' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    Data Insights
                  </CardTitle>
                  <CardDescription>
                    What the AI can analyze
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Funding trends by sector
                  </Badge>
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Growth rate correlations
                  </Badge>
                  <Badge className="mr-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100">
                    Top startups by metric
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            {showScorecard ? (
              <ScoreCard
                startupName="TechPro Analytics"
                sector="SaaS - Analytics for Healthcare"
                metrics={sampleMetrics}
                overallScore={8.5}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed rounded-lg p-8 text-center animate-scale-in">
                <div>
                  <h3 className="text-lg font-medium mb-2">Ask about a startup</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Ask the AI assistant to generate a scorecard for any startup in the database, 
                    compare startups, or get insights on specific sectors or metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;

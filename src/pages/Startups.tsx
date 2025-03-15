import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StartupList, { StartupListItem } from '@/components/StartupList';
import ScoreCard, { ScoreCardMetric } from '@/components/ScoreCard';
import SectorSelect from '@/components/SectorSelect';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

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
  },
  {
    id: '4',
    name: 'EduBrain',
    sector: 'EdTech',
    score: 8.1,
    monthlyVisits: 80000,
    lastFunding: 15000000,
    valuation: 75000000,
    cagr: 30
  },
  {
    id: '5',
    name: 'ShopSmart',
    sector: 'E-commerce',
    score: 7.5,
    monthlyVisits: 350000,
    lastFunding: 50000000,
    valuation: 200000000,
    cagr: 25
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

const Startups: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartupId, setSelectedStartupId] = useState<string | undefined>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented here
  };

  // Filter startups based on sector and search query
  const filteredStartups = sampleStartups
    .filter(startup => 
      selectedSector === 'all' || startup.sector === selectedSector
    )
    .filter(startup => 
      searchQuery === '' || 
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.sector.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedStartup = sampleStartups.find(startup => startup.id === selectedStartupId);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-blur-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Startups Database</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Explore and analyze startups across different sectors
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-5">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex w-full gap-2">
                <Input
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Search size={18} />
                </Button>
              </form>

              <SectorSelect 
                sectors={sampleSectors}
                selectedSector={selectedSector}
                onChange={setSelectedSector}
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-270px)]">
              <h2 className="text-lg font-semibold">
                {filteredStartups.length} {filteredStartups.length === 1 ? 'Startup' : 'Startups'} Found
              </h2>
              <StartupList
                startups={filteredStartups}
                onStartupSelect={setSelectedStartupId}
                selectedStartupId={selectedStartupId}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedStartup ? (
              <ScoreCard
                startupName={selectedStartup.name}
                sector={selectedStartup.sector}
                metrics={sampleMetrics}
                overallScore={selectedStartup.score}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed rounded-lg p-8 text-center">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a startup to view details</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Choose a startup from the list to see its detailed scorecard
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

export default Startups;

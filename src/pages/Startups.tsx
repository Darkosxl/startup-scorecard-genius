
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StartupList, { StartupListItem } from '@/components/StartupList';
import ScoreCard, { ScoreCardMetric } from '@/components/ScoreCard';
import SectorSelect from '@/components/SectorSelect';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';
import { useStartups } from '@/context/StartupsContext';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Sample data for sectors
const sampleSectors = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce'];

const Startups: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartupId, setSelectedStartupId] = useState<string | undefined>();
  const [hideZeroScores, setHideZeroScores] = useState(false);
  const [hideUnknownNames, setHideUnknownNames] = useState(false);
  
  // Use the global startups context
  const { startups } = useStartups();

  // Extract unique sectors from the data
  const sectors = startups.length > 0 
    ? Array.from(new Set(startups.map(startup => startup.sector))).filter(Boolean)
    : sampleSectors;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented here
  };

  // Generate metrics for the selected startup
  const generateMetricsForStartup = (startup: StartupListItem): ScoreCardMetric[] => {
    if (!startup) return [];
    
    return [
      { 
        criteria: 'Monthly Visits', 
        value: `${(startup.monthlyVisits / 1000).toFixed(1)}K visitors`, 
        importance: 'Medium', 
        score: Math.min(Math.round(startup.monthlyVisits / 50000), 10) 
      },
      { 
        criteria: 'Last Funding', 
        value: `$${(startup.lastFunding / 1000000).toFixed(1)}M`, 
        importance: 'High', 
        score: Math.min(Math.round(startup.lastFunding / 10000000), 10) 
      },
      { 
        criteria: 'Valuation', 
        value: `$${(startup.valuation / 1000000).toFixed(1)}M`, 
        importance: 'High', 
        score: Math.min(Math.round(startup.valuation / 50000000), 10) 
      },
      { 
        criteria: 'CAGR', 
        value: `${startup.cagr}%`, 
        importance: 'Very High', 
        score: Math.min(Math.round(startup.cagr / 5), 10) 
      },
      { 
        criteria: 'Market Position', 
        value: 'Based on sector analysis', 
        importance: 'Medium', 
        score: 7 
      },
      { 
        criteria: 'Overall Growth Potential', 
        value: `${Math.round(startup.score * 10)}% growth score`, 
        importance: 'High', 
        score: Math.round(startup.score) 
      },
    ];
  };

  // Filter startups based on sector, search query, and checkboxes
  const filteredStartups = startups
    .filter(startup => 
      selectedSector === 'all' || startup.sector === selectedSector
    )
    .filter(startup => 
      searchQuery === '' || 
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.sector.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(startup => 
      !hideZeroScores || startup.score > 0
    )
    .filter(startup => 
      !hideUnknownNames || (startup.name !== 'Unknown' && startup.name.trim() !== '')
    );

  const selectedStartup = startups.find(startup => startup.id === selectedStartupId);

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
                sectors={sectors}
                selectedSector={selectedSector}
                onChange={setSelectedSector}
              />
              
              <div className="bg-background border rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-medium">Filter Options</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hide-zero-scores" 
                      checked={hideZeroScores} 
                      onCheckedChange={(checked) => setHideZeroScores(checked === true)}
                    />
                    <Label htmlFor="hide-zero-scores" className="text-sm cursor-pointer">
                      Hide startups with 0 score
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hide-unknown-names" 
                      checked={hideUnknownNames} 
                      onCheckedChange={(checked) => setHideUnknownNames(checked === true)}
                    />
                    <Label htmlFor="hide-unknown-names" className="text-sm cursor-pointer">
                      Hide startups with unknown names
                    </Label>
                  </div>
                </div>
              </div>
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
                metrics={generateMetricsForStartup(selectedStartup)}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Database, FileSpreadsheet, Layers } from 'lucide-react';
import { StartupListItem } from '@/components/StartupList';
import { useStartups } from '@/context/StartupsContext';

const Upload: React.FC = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [parsedData, setParsedData] = useState<StartupListItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addStartups } = useStartups();

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    setIsUploaded(true);
    
    // Process the CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const startups = parseCSV(csvData);
        setParsedData(startups);
        
        toast({
          title: "File parsed successfully",
          description: `Found ${startups.length} startups in the uploaded file`,
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Error parsing file",
          description: "The file format may be incorrect or corrupted",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvData: string): StartupListItem[] => {
    // Split the CSV data into rows
    const rows = csvData.split('\n');
    
    // Extract header row (assuming first row is header)
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    
    // Map CSV data to startup objects
    return rows.slice(1).filter(row => row.trim()).map((row, index) => {
      const values = row.split(',').map(value => value.trim());
      
      // Create a startup object with default values
      const startup: StartupListItem = {
        id: (index + 1).toString(),
        name: 'Unknown',
        sector: 'Unknown',
        score: 0,
        monthlyVisits: 0,
        lastFunding: 0,
        valuation: 0,
        cagr: 0,
      };
      
      // Map CSV values to startup properties based on headers
      headers.forEach((header, i) => {
        const value = values[i];
        
        if (header.includes('name') || header === 'startup') {
          startup.name = value;
        } else if (header.includes('sector') || header.includes('industry')) {
          startup.sector = value;
        } else if (header.includes('monthly visits') || header.includes('visits')) {
          startup.monthlyVisits = parseInt(value.replace(/[^0-9.]/g, '')) || 0;
        } else if (header.includes('last funding') || header.includes('funding')) {
          startup.lastFunding = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        } else if (header.includes('valuation')) {
          startup.valuation = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        } else if (header.includes('cagr') || header.includes('growth')) {
          startup.cagr = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        } else if (header.includes('score')) {
          startup.score = parseFloat(value) || calculateScore(startup);
        }
      });
      
      // Calculate score if not provided
      if (startup.score === 0) {
        startup.score = calculateScore(startup);
      }
      
      return startup;
    });
  };
  
  // Simple scoring function based on available metrics
  const calculateScore = (startup: StartupListItem): number => {
    let score = 0;
    
    // Weight factors (these could be customizable)
    const weights = {
      monthlyVisits: 0.2,
      lastFunding: 0.25,
      valuation: 0.25,
      cagr: 0.3
    };
    
    // Normalize and add weighted scores
    if (startup.monthlyVisits > 0) score += (Math.min(startup.monthlyVisits / 100000, 10) * weights.monthlyVisits);
    if (startup.lastFunding > 0) score += (Math.min(startup.lastFunding / 10000000, 10) * weights.lastFunding);
    if (startup.valuation > 0) score += (Math.min(startup.valuation / 100000000, 10) * weights.valuation);
    if (startup.cagr > 0) score += (Math.min(startup.cagr / 10, 10) * weights.cagr);
    
    return Math.min(Math.round(score * 10) / 10, 10);
  };

  const handleProcessData = () => {
    // Add startups to context instead of directly to localStorage
    addStartups(parsedData);
    
    toast({
      title: "Data processed successfully",
      description: "Your startup data has been processed and is ready for analysis",
    });
    
    // Navigate to startups page
    navigate('/startups');
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-blur-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Upload Startup Data</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Import your startup dataset for analysis and scoring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileUploader onFileUpload={handleFileUpload} />
            
            {isUploaded && (
              <div className="mt-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Options</CardTitle>
                    <CardDescription>Configure how your data should be processed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Data Processing Settings</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                          These settings determine how the data is processed and analyzed
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Skip Header Row</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" defaultChecked />
                                <span className="ml-2 text-sm">First row contains column names</span>
                              </label>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Normalize Scores</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" defaultChecked />
                                <span className="ml-2 text-sm">Normalize scores to 0-10 scale</span>
                              </label>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="mt-4">
                          <Button onClick={handleProcessData} className="w-full">
                            Process Data
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <div>
            <div className="space-y-4">
              <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                    Supported Formats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-green-500 h-1.5 w-1.5 mr-2"></span>
                      CSV files (.csv)
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-green-500 h-1.5 w-1.5 mr-2"></span>
                      Excel files (.xlsx, .xls)
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    Data Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Your data should include these core metrics:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Startup name and sector
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Monthly visits
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Funding details (amount, rounds)
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Valuation metrics
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Growth rates and CAGR
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2"></span>
                      Market size information
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-primary" />
                    What Happens Next
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm ml-4 list-decimal">
                    <li>Your data is processed and validated</li>
                    <li>AI weighing system analyzes the metrics</li>
                    <li>Startups are scored on a 0-10 scale</li>
                    <li>Scorecards are generated for each startup</li>
                    <li>Data becomes available for AI chat analysis</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;

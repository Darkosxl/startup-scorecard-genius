import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Database, FileSpreadsheet, Layers, Trash2 } from 'lucide-react';
import { StartupListItem } from '@/components/StartupList';
import { useStartups } from '@/context/StartupsContext';
import { Badge } from "@/components/ui/badge";
// If you have a custom Input component, import it from there:
// import { Input } from "@/components/ui/input";

const Upload: React.FC = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [parsedData, setParsedData] = useState<StartupListItem[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Bring in startups from context
  const { addStartups, clearStartups, startups } = useStartups();

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    setIsUploaded(true);
    setFileName(file.name);

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

  const handleImportFromSheets = async () => {
    if (!googleSheetsUrl.trim()) {
      toast({
        title: "No URL provided",
        description: "Please paste a publicly accessible Google Sheets CSV link.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(googleSheetsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }

      const csvData = await response.text();
      const startupsFromSheets = parseCSV(csvData);

      setParsedData(startupsFromSheets);
      setIsUploaded(true);
      // We can label the "file" as "Google Sheets" for clarity
      setFileName("Google Sheets Import");

      toast({
        title: "Imported from Google Sheets",
        description: `Found ${startupsFromSheets.length} startups in the provided sheet`,
      });
    } catch (error) {
      console.error("Error importing from Google Sheets:", error);
      toast({
        title: "Failed to import from Google Sheets",
        description: "Make sure the URL is publicly accessible and published as CSV.",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (csvData: string): StartupListItem[] => {
    // Split the CSV data into rows
    const rows = csvData.split('\n');

    // Extract header row (assuming first row is header)
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());

    // Map CSV data to startup objects
    return rows
      .slice(1)
      .filter(row => row.trim())
      .map((row, index) => {
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
          missingFields: [] as string[],
        };

        // Keep track of original column data for scorecard
        startup.originalData = {};

        // Map CSV values to startup properties based on headers
        headers.forEach((header, i) => {
          const value = values[i];

          if (header.includes('name') || header === 'startup') {
            startup.name = value || 'Unknown';
          } else if (header.includes('sector') || header.includes('industry')) {
            startup.sector = value || 'Unknown';
          } else if (header.includes('monthly visits') || header.includes('visits')) {
            startup.monthlyVisits = parseInt(value.replace(/[^0-9.]/g, '')) || 0;
            if (!value || parseInt(value.replace(/[^0-9.]/g, '')) === 0) {
              startup.missingFields.push('monthlyVisits');
            }
            startup.originalData[header] = value || '0';
          } else if (header.includes('last funding') || header.includes('funding')) {
            startup.lastFunding = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            if (!value || parseFloat(value.replace(/[^0-9.]/g, '')) === 0) {
              startup.missingFields.push('lastFunding');
            }
            startup.originalData[header] = value || '0';
          } else if (header.includes('valuation')) {
            startup.valuation = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            if (!value || parseFloat(value.replace(/[^0-9.]/g, '')) === 0) {
              startup.missingFields.push('valuation');
            }
            startup.originalData[header] = value || '0';
          } else if (header.includes('cagr') || header.includes('growth')) {
            startup.cagr = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            if (!value || parseFloat(value.replace(/[^0-9.]/g, '')) === 0) {
              startup.missingFields.push('cagr');
            }
            startup.originalData[header] = value || '0';
          } else if (header.includes('score')) {
            startup.score = parseFloat(value) || 0;
            if (!value || parseFloat(value) === 0) {
              startup.missingFields.push('score');
            }
            startup.originalData[header] = value || '0';
          } else {
            // Save any additional columns as original data
            startup.originalData[header] = value || '';
          }
        });

        // Calculate score if not provided, ignoring missing fields
        if (startup.score === 0) {
          startup.score = calculateScore(startup);
        }

        return startup;
      });
  };

  // Simple scoring function based on available metrics, ignoring missing fields
  const calculateScore = (startup: StartupListItem): number => {
    let score = 0;
    let totalWeight = 0;

    // Weight factors (these could be customizable)
    const weights = {
      monthlyVisits: 0.2,
      lastFunding: 0.25,
      valuation: 0.25,
      cagr: 0.3
    };

    // Normalize and add weighted scores, ignoring missing fields
    if (!startup.missingFields.includes('monthlyVisits') && startup.monthlyVisits > 0) {
      score += (Math.min(startup.monthlyVisits / 100000, 10) * weights.monthlyVisits);
      totalWeight += weights.monthlyVisits;
    }

    if (!startup.missingFields.includes('lastFunding') && startup.lastFunding > 0) {
      score += (Math.min(startup.lastFunding / 10000000, 10) * weights.lastFunding);
      totalWeight += weights.lastFunding;
    }

    if (!startup.missingFields.includes('valuation') && startup.valuation > 0) {
      score += (Math.min(startup.valuation / 100000000, 10) * weights.valuation);
      totalWeight += weights.valuation;
    }

    if (!startup.missingFields.includes('cagr') && startup.cagr > 0) {
      score += (Math.min(startup.cagr / 10, 10) * weights.cagr);
      totalWeight += weights.cagr;
    }

    // If no fields are present, return 0
    if (totalWeight === 0) return 0;

    // Normalize score to 1-10 scale based on available weights
    return Math.max(Math.min(Math.round((score / totalWeight) * 10) / 10 * 10, 10), 1);
  };

  const handleProcessData = () => {
    // Add startups to context
    addStartups(parsedData);

    toast({
      title: "Data processed successfully",
      description: "Your startup data has been processed and is ready for analysis",
    });

    // Navigate to startups page
    navigate('/startups');
  };

  const handleDeleteData = () => {
    // If there's no data, show a toast instead
    if (startups.length === 0) {
      toast({
        title: "No data to delete",
        description: "There is currently no startup data to remove",
      });
      return;
    }

    clearStartups();
    setIsUploaded(false);
    setParsedData([]);
    setFileName(null);

    toast({
      title: "Data deleted",
      description: "Your startup dataset has been removed from the system",
      variant: "default"
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-blur-in">
        {/* Header with "Delete All Data" button always enabled */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Startup Data</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Import your startup dataset for analysis and scoring
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteData}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete All Data
          </Button>
        </div>

        {/* Display the file name badge + a delete button if a file was selected */}
        {fileName && (
          <div className="flex items-center mt-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            <Badge variant="outline" className="mr-2 py-1 px-2">
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              {fileName}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDeleteData}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Dataset
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Existing file uploader */}
            <FileUploader onFileUpload={handleFileUpload} />

            {/* New "Import from Google Sheets" section */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Or Import from Google Sheets
              </label>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Paste a public link that returns CSV data (e.g. published sheet).
              </p>
              <div className="flex gap-2">
                {/* If you have a custom Input component, replace <input> below */}
                <input
                  type="text"
                  className="border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm flex-1"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={googleSheetsUrl}
                  onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                />
                <Button onClick={handleImportFromSheets}>
                  Import
                </Button>
              </div>
            </div>
            
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
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-primary"
                                  defaultChecked
                                />
                                <span className="ml-2 text-sm">
                                  First row contains column names
                                </span>
                              </label>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Normalize Scores</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-primary"
                                  defaultChecked
                                />
                                <span className="ml-2 text-sm">
                                  Normalize scores to 1-10 scale
                                </span>
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
                    <li>Startups are scored on a 1-10 scale</li>
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

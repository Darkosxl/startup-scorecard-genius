
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Database, FileSpreadsheet, Layers } from 'lucide-react';

const Upload: React.FC = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    setIsUploaded(true);
    
    // This would be replaced with actual file processing logic
  };

  const handleProcessData = () => {
    // This would be replaced with actual data processing logic
    toast({
      title: "Data processed successfully",
      description: "Your startup data has been processed and is ready for analysis",
    });
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

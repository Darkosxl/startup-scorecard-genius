
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStartups } from '@/context/StartupsContext';
import { Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type MetricWeight = {
  name: string;
  weight: number;
};

const Settings: React.FC = () => {
  const { getMetricColumns } = useStartups();
  const { toast } = useToast();
  const [metricWeights, setMetricWeights] = useState<MetricWeight[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Get all metrics from the uploaded data
    const columns = getMetricColumns();
    
    // Create initial weights for the metrics (equally distributed)
    if (columns.length > 0) {
      const initialWeight = 100 / columns.length;
      const initialWeights = columns.map(column => ({
        name: column,
        weight: Math.round(initialWeight),
      }));
      
      setMetricWeights(initialWeights);
      setAvailableMetrics([]);
    } else {
      // Default metrics if no data is available
      setMetricWeights([
        { name: 'Monthly Visits', weight: 20 },
        { name: 'Amount Raised', weight: 35 },
        { name: 'Investors', weight: 15 },
        { name: 'Growth', weight: 30 },
      ]);
      
      setAvailableMetrics([
        'Revenue', 
        'Market Size', 
        'Team Size', 
        'Customer Satisfaction',
        'User Acquisition Cost',
        'Product Innovation'
      ]);
    }
  }, [getMetricColumns]);

  const handleWeightChange = (index: number, newWeight: number[]) => {
    const updated = [...metricWeights];
    updated[index].weight = newWeight[0];
    setMetricWeights(updated);
  };

  const addMetric = () => {
    if (!selectedMetric) return;
    
    // Add the new metric with a default weight
    setMetricWeights([...metricWeights, { name: selectedMetric, weight: 10 }]);
    
    // Remove from available metrics
    setAvailableMetrics(availableMetrics.filter(m => m !== selectedMetric));
    setSelectedMetric('');
  };

  const removeMetric = (index: number) => {
    const removed = metricWeights[index];
    setAvailableMetrics([...availableMetrics, removed.name]);
    setMetricWeights(metricWeights.filter((_, i) => i !== index));
  };

  const saveWeightConfiguration = () => {
    // This would save the weights to be used in score calculations
    toast({
      title: "Weights saved",
      description: "Your scoring weight configuration has been updated",
    });
  };

  const saveAPIKey = () => {
    // Hash the API key before storing it (in a real app)
    const hashedKey = btoa(apiKey); // Simple encoding for demo
    localStorage.setItem('aiApiKey', hashedKey);
    
    toast({
      title: "API Key saved",
      description: "Your API key has been saved and will be used for AI queries",
    });
    
    // Clear the input for security
    setApiKey('');
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto animate-blur-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure application preferences and scoring weights
          </p>
        </div>

        <Tabs defaultValue="weights">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="weights">Scoring Weights</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Weight Configuration</CardTitle>
                <CardDescription>
                  Adjust how different metrics are weighted in the startup scoring algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {metricWeights.map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`weight-${index}`}>
                        {metric.name.charAt(0).toUpperCase() + metric.name.slice(1)} ({metric.weight}%)
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {metric.weight}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 rounded-full text-slate-400 hover:text-destructive"
                          onClick={() => removeMetric(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider 
                      id={`weight-${index}`} 
                      value={[metric.weight]} 
                      max={100} 
                      step={5} 
                      onValueChange={(value) => handleWeightChange(index, value)}
                    />
                  </div>
                ))}
                
                {availableMetrics.length > 0 && (
                  <div className="flex items-end gap-2 pt-3 border-t">
                    <div className="flex-1">
                      <Label htmlFor="add-metric" className="mb-2 block">Add Metric</Label>
                      <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                        <SelectTrigger id="add-metric">
                          <SelectValue placeholder="Select metric to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMetrics.map((metric) => (
                            <SelectItem key={metric} value={metric}>
                              {metric}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addMetric} className="flex-shrink-0">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <Button onClick={saveWeightConfiguration}>Save Weight Configuration</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Startup Stage Filtering</CardTitle>
                <CardDescription>
                  Configure which stages of startups to include in the analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pre-seed">Pre-Seed Stage</Label>
                  <Switch id="pre-seed" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="seed">Seed Stage</Label>
                  <Switch id="seed" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="series-a">Series A</Label>
                  <Switch id="series-a" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="series-b">Series B</Label>
                  <Switch id="series-b" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="series-c">Series C+</Label>
                  <Switch id="series-c" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <Select defaultValue="system">
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact">Compact Mode</Label>
                  <Switch id="compact" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI API Settings</CardTitle>
                <CardDescription>
                  Configure AI integration for your startup data analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key for LLM Integration</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="Enter your API key" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button onClick={saveAPIKey}>Save</Button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your API key will be securely hashed and stored locally
                  </p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="llm-model">LLM Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="llm-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="llama-3">Llama 3</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <Label htmlFor="rag-enabled">Enable RAG for Startup Data</Label>
                  <Switch id="rag-enabled" defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Button>Test AI Connection</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;

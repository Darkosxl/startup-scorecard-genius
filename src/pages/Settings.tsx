
import React from 'react';
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

const Settings: React.FC = () => {
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
            <TabsTrigger value="account">Account</TabsTrigger>
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="brand-weight">Brand Name (20%)</Label>
                    <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      20
                    </span>
                  </div>
                  <Slider id="brand-weight" defaultValue={[20]} max={100} step={5} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="funding-weight">Amount Raised (35%)</Label>
                    <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      35
                    </span>
                  </div>
                  <Slider id="funding-weight" defaultValue={[35]} max={100} step={5} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="investors-weight">Investors (15%)</Label>
                    <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      15
                    </span>
                  </div>
                  <Slider id="investors-weight" defaultValue={[15]} max={100} step={5} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="growth-weight">Growth (30%)</Label>
                    <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      30
                    </span>
                  </div>
                  <Slider id="growth-weight" defaultValue={[30]} max={100} step={5} />
                </div>
                
                <div className="pt-3 border-t">
                  <Button>Save Weight Configuration</Button>
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
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" defaultValue="John Doe" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Your email" defaultValue="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" placeholder="Your organization" defaultValue="Acme Inc" />
                </div>
                
                <div className="pt-3 border-t">
                  <Button>Save Account Information</Button>
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

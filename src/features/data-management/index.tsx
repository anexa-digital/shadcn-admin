import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccounts } from '@/hooks/use-accounts';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '../accounts/columns';
import { RefreshCcw, Database, Download, Upload } from 'lucide-react';

export default function DataManagementPage() {
  const { accountsQuery, tokenStatusQuery } = useAccounts();
  const [activeTab, setActiveTab] = useState('overview');
  
  const refreshData = () => {
    accountsQuery.refetch();
    tokenStatusQuery.refetch();
  };

  const downloadData = () => {
    // Convert data to CSV or JSON
    const data = accountsQuery.data || [];
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">View and manage your messaging data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={downloadData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accountsQuery.data?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 10)}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Authentication Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tokenStatusQuery.isSuccess ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last checked: {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accountsQuery.isFetching ? (
                    <span className="text-yellow-500">Fetching</span>
                  ) : accountsQuery.isError ? (
                    <span className="text-red-500">Error</span>
                  ) : (
                    <span className="text-green-500">Online</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Account Data</CardTitle>
              <CardDescription>
                View and manage messaging accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountsQuery.isLoading ? (
                <div className="flex justify-center p-8">Loading accounts...</div>
              ) : accountsQuery.isError ? (
                <div className="flex justify-center p-8 text-red-500">
                  Error loading accounts: {accountsQuery.error?.message}
                </div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={accountsQuery.data || []} 
                  searchColumn="name"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization</CardTitle>
              <CardDescription>
                Manage data synchronization between systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5" />
                    <h3 className="font-medium">Import Data</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Import account data from external systems
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload JSON
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5" />
                    <h3 className="font-medium">Export Data</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export account data to external systems
                  </p>
                  <Button variant="outline" className="w-full" onClick={downloadData}>
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCcw className="h-5 w-5" />
                  <h3 className="font-medium">Synchronization Schedule</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure automatic data synchronization schedule
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">Hourly</Button>
                  <Button variant="outline" size="sm">Daily</Button>
                  <Button variant="outline" size="sm">Weekly</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={refreshData}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
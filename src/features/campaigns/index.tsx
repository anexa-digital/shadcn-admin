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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Plus, CalendarClock, Users, Send, Clock, ArrowUpRight } from 'lucide-react';
import { useAccounts } from '@/hooks/use-accounts';

// Mock campaigns data
const mockCampaigns = [
  {
    id: 1,
    name: 'New Product Launch',
    status: 'active',
    startDate: '2023-05-20T10:00:00',
    endDate: '2023-06-20T23:59:59',
    audience: 5000,
    delivered: 3200,
    read: 2800,
    clicked: 1500,
    progress: 64,
    accountId: 1,
  },
  {
    id: 2,
    name: 'Summer Sale Promotion',
    status: 'scheduled',
    startDate: '2023-06-01T08:00:00',
    endDate: '2023-06-15T23:59:59',
    audience: 8000,
    delivered: 0,
    read: 0,
    clicked: 0,
    progress: 0,
    accountId: 1,
  },
  {
    id: 3,
    name: 'Customer Feedback Survey',
    status: 'completed',
    startDate: '2023-04-10T09:00:00',
    endDate: '2023-04-25T23:59:59',
    audience: 3000,
    delivered: 3000,
    read: 2500,
    clicked: 1200,
    progress: 100,
    accountId: 2,
  },
  {
    id: 4,
    name: 'Loyalty Program Update',
    status: 'draft',
    startDate: null,
    endDate: null,
    audience: 4500,
    delivered: 0,
    read: 0,
    clicked: 0,
    progress: 0,
    accountId: 3,
  },
];

// Chart data
const chartData = [
  { name: 'Launch', sent: 5000, delivered: 4800, read: 3200, clicked: 1500 },
  { name: 'Sale', sent: 8000, delivered: 7600, read: 5400, clicked: 2300 },
  { name: 'Survey', sent: 3000, delivered: 3000, read: 2500, clicked: 1200 },
  { name: 'Loyalty', sent: 4500, delivered: 4300, read: 3800, clicked: 1800 },
];

export default function CampaignsPage() {
  const { accountsQuery } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  
  // Format timestamp
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return 'Not scheduled';
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Status badge styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'default', className: 'bg-green-500' };
      case 'scheduled':
        return { variant: 'outline', className: 'text-yellow-500 border-yellow-500' };
      case 'completed':
        return { variant: 'secondary', className: '' };
      case 'draft':
        return { variant: 'outline', className: '' };
      default:
        return { variant: 'outline', className: '' };
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage messaging campaigns</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Overview of messaging campaign metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                  <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                  <Bar dataKey="read" fill="#ffc658" name="Read" />
                  <Bar dataKey="clicked" fill="#ff8042" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              View and manage your messaging campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => {
                const account = accountsQuery.data?.find(a => a.id === campaign.accountId);
                const statusStyle = getStatusStyles(campaign.status);
                
                return (
                  <div key={campaign.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge 
                            variant={statusStyle.variant as any} 
                            className={statusStyle.className}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {account?.name ? `Via ${account.name}` : 'No account specified'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span className="text-xs">Details</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="text-muted-foreground">Start Date</div>
                          <div>{formatDate(campaign.startDate)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="text-muted-foreground">End Date</div>
                          <div>{formatDate(campaign.endDate)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="text-muted-foreground">Audience</div>
                          <div>{campaign.audience.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="text-muted-foreground">Delivered</div>
                          <div>{campaign.delivered.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline">View All Campaigns</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 
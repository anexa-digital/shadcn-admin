import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccounts } from '@/hooks/use-accounts';
import { MessageCircle, Search, Filter, RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock messages data until we have a real API endpoint
const mockMessages = [
  {
    id: 1,
    accountId: 1,
    sender: '+1234567890',
    content: 'Hello, I need assistance with my order #12345',
    timestamp: new Date('2023-05-15T10:30:00').toISOString(),
    status: 'delivered',
  },
  {
    id: 2,
    accountId: 1,
    sender: '+0987654321',
    content: 'When will my package arrive?',
    timestamp: new Date('2023-05-15T11:15:00').toISOString(),
    status: 'delivered',
  },
  {
    id: 3,
    accountId: 2,
    sender: '+1122334455',
    content: 'I want to place a new order. Is there any discount available?',
    timestamp: new Date('2023-05-16T09:45:00').toISOString(),
    status: 'read',
  },
  {
    id: 4,
    accountId: 2,
    sender: '+5566778899',
    content: 'Please update my shipping address to 123 New Street.',
    timestamp: new Date('2023-05-16T14:20:00').toISOString(),
    status: 'sent',
  },
  {
    id: 5,
    accountId: 3,
    sender: '+2468013579',
    content: 'I need to cancel my subscription.',
    timestamp: new Date('2023-05-17T08:10:00').toISOString(),
    status: 'delivered',
  },
];

export default function MessagesPage() {
  const { accountsQuery } = useAccounts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter messages based on search term and selected account
  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         message.sender.includes(searchTerm);
    const matchesAccount = selectedAccount === 'all' || message.accountId.toString() === selectedAccount;
    return matchesSearch && matchesAccount;
  });
  
  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'sent':
        return 'bg-blue-500';
      case 'read':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">View and manage incoming messages</p>
        </div>
        <Button onClick={refreshData}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Filters</CardTitle>
            <CardDescription>
              Filter messages by account and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accountsQuery.data?.map((account) => (
                    <SelectItem key={account.id} value={account.id?.toString() || ''}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Message List</CardTitle>
              <CardDescription>
                Showing {filteredMessages.length} messages
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {selectedAccount === 'all' ? 'All Accounts' : 'Filtered'}
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-md">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No Messages Found</h3>
                <p className="text-muted-foreground">
                  No messages match your current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => {
                  const account = accountsQuery.data?.find(a => a.id === message.accountId);
                  return (
                    <div key={message.id} className="flex items-start gap-4 p-4 border rounded-md hover:bg-muted/50">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {message.sender}
                            {account && (
                              <span className="ml-2 text-sm text-muted-foreground">
                                via {account.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(message.timestamp)}
                            </span>
                            <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor(message.status)}`} />
                          </div>
                        </div>
                        <p className="text-sm mt-1">{message.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
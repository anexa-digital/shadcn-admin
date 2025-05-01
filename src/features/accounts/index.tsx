import { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/use-accounts';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { CreateAccountDialog } from './create-account-dialog';

export default function AccountsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { accountsQuery } = useAccounts();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your WhatsApp accounts</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Accounts List</CardTitle>
          <CardDescription>
            View and manage all your WhatsApp accounts
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

      <CreateAccountDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
} 
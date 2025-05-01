import { ColumnDef } from "@tanstack/react-table";
import { MassChatAccount } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<MassChatAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => {
      const provider = row.getValue("provider") as string | null;
      return provider ? (
        <Badge variant="outline">{provider}</Badge>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
    cell: ({ row }) => {
      const endpoint = row.getValue("endpoint") as string | null;
      return endpoint ? (
        <span className="max-w-[200px] truncate">{endpoint}</span>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "create_date",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("create_date") as string | null;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return format(new Date(date), "MMM d, yyyy");
    },
  },
]; 
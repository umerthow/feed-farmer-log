import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type LogEntry = {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
};

const logEntries: LogEntry[] = [
  {
    id: '1',
    timestamp: '2023-10-15 09:23:45',
    action: 'Create Receipt',
    details: 'Created new receipt: Dairy Cow Mix',
    user: 'John Farmer'
  },
  {
    id: '2',
    timestamp: '2023-10-15 10:45:12',
    action: 'Update Ingredient',
    details: 'Updated price of Corn to $0.45/kg',
    user: 'John Farmer'
  },
  {
    id: '3',
    timestamp: '2023-10-16 08:15:30',
    action: 'Create Ingredient',
    details: 'Added new ingredient: Wheat Bran',
    user: 'Maria Ranch'
  },
  {
    id: '4',
    timestamp: '2023-10-16 14:22:18',
    action: 'Delete Receipt',
    details: 'Deleted receipt: Test Mix',
    user: 'John Farmer'
  },
  {
    id: '5',
    timestamp: '2023-10-17 11:05:42',
    action: 'Update Receipt',
    details: 'Updated Goat Feed: changed fed amount to 5kg',
    user: 'Maria Ranch'
  },
];

const ActivityLog = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Activity Log</h1>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.timestamp}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>{entry.details}</TableCell>
                <TableCell>{entry.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLog;

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  clients: number;
};

const agents: Agent[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    region: 'North',
    clients: 12
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    region: 'South',
    clients: 8
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '(555) 456-7890',
    region: 'East',
    clients: 15
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '(555) 789-0123',
    region: 'West',
    clients: 10
  },
];

const Agents = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Agents</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${agent.name}&background=16a34a&color=fff`} />
                  <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.region} Region</p>
                <p className="text-sm mt-2">{agent.email}</p>
                <p className="text-sm">{agent.phone}</p>
                <p className="mt-2 text-green-600 font-medium">{agent.clients} Clients</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Clients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.phone}</TableCell>
                <TableCell>{agent.region}</TableCell>
                <TableCell>{agent.clients}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Agents;

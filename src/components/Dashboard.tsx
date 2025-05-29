import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{ name: 'Jan', value: 400 },
	{ name: 'Feb', value: 300 },
	{ name: 'Mar', value: 600 },
	{ name: 'Apr', value: 800 },
	{ name: 'May', value: 500 },
	{ name: 'Jun', value: 350 },
];

const Dashboard = () => {
	return (
		<div className="flex h-screen">
			<div className="flex-1 overflow-auto p-6 space-y-6">
				<h1 className="text-3xl font-bold">Dashboard</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
							<CardDescription>Recipe count</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Ingredients</CardTitle>
							<CardDescription>Ingredient count</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">36</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Avg. Cost</CardTitle>
							<CardDescription>Per kg</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$2.45</div>
						</CardContent>
					</Card>
				</div>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Monthly Feed Production</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={data}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="value" fill="#16a34a" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Recent Recipes</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="p-2 bg-gray-50 rounded-md">Dairy Cow Mix - $3.20/kg</li>
								<li className="p-2 bg-gray-50 rounded-md">Beef Cattle Feed - $2.85/kg</li>
								<li className="p-2 bg-gray-50 rounded-md">Goat Feed Formula - $2.95/kg</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Low Stock Ingredients</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="p-2 bg-gray-50 rounded-md">Corn - 50kg remaining</li>
								<li className="p-2 bg-gray-50 rounded-md">Soybean Meal - 25kg remaining</li>
								<li className="p-2 bg-gray-50 rounded-md">Minerals - 10kg remaining</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

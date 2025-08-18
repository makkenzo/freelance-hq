'use client';

import { formatDuration } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
    data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Month
                    </Button>
                    <Button variant="ghost" size="sm">
                        Year
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-2">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground">Not enough data to display the chart.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

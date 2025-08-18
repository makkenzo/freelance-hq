import { Card, CardContent } from '@/ui/card';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    change?: string;
    trend?: string;
    icon: LucideIcon;
    changeType?: 'positive' | 'negative' | 'neutral';
}

export function MetricCard({ title, value, change, trend, icon: Icon, changeType = 'neutral' }: MetricCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-500">{title}</span>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="flex items-center gap-2 mt-1">
                        {change && (
                            <span
                                className={`text-sm font-medium ${
                                    changeType === 'positive'
                                        ? 'text-green-600'
                                        : changeType === 'negative'
                                          ? 'text-red-600'
                                          : 'text-gray-500'
                                }`}
                            >
                                {change}
                            </span>
                        )}
                        {trend && <span className="text-sm text-gray-500">{trend}</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

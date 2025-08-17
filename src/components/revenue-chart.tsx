import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RevenueChartPlaceholder() {
    return (
        <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Week
                    </Button>
                    <Button variant="ghost" size="sm">
                        Month
                    </Button>
                    <Button variant="ghost" size="sm">
                        Year
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] bg-gray-50 rounded-b-lg flex items-center justify-center">
                <p className="text-muted-foreground">[Chart will be here]</p>
            </CardContent>
        </Card>
    );
}

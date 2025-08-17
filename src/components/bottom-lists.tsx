import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function BottomListsPlaceholder() {
    return (
        <>
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        View All
                    </Link>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 bg-gray-50 rounded-b-lg">
                    <p className="text-muted-foreground">[Task list will be here]</p>
                </CardContent>
            </Card>
            <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Clients</CardTitle>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        View All
                    </Link>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 bg-gray-50 rounded-b-lg">
                    <p className="text-muted-foreground">[Client list will be here]</p>
                </CardContent>
            </Card>
        </>
    );
}

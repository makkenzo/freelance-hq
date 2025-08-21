export function getDateFilter(period?: string): string {
    if (!period) return '';
    const now = new Date();
    let startDate = new Date();

    if (period === 'last_7_days') {
        startDate.setDate(now.getDate() - 7);
    } else if (period === 'last_30_days') {
        startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'last_12_months') {
        startDate.setFullYear(now.getFullYear() - 1);
    } else {
        return ''; // all_time
    }

    return `created >= "${startDate.toISOString().slice(0, 19).replace('T', ' ')}"`;
}

import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Clock, FileText, TrendingUp } from 'lucide-react';

export default function FreelanceHQPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">Freelance HQ</div>

                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                Features
                            </a>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost">Log in</Button>
                            <Button>Sign up free</Button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                                Manage your freelance business with confidence
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                All-in-one platform for invoicing, time tracking, and client management designed for
                                independent professionals.
                            </p>
                            <div className="flex space-x-4 mb-8">
                                <Button size="lg">Start for free</Button>
                                <Button variant="outline" size="lg">
                                    Watch demo
                                </Button>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span>No credit card required</span>
                            </div>
                        </div>
                        <div className="relative">
                            <Card className="bg-white shadow-xl">
                                <CardContent className="p-0 h-[400px]"></CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to run your freelance business
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Freelance HQ combines all the tools you need into one seamless platform, helping you focus
                            on what matters most.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center p-8">
                            <CardContent className="space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold">Time Tracking</h3>
                                <p className="text-gray-600">
                                    Track time for projects with a simple one-click timer. Categorize hours and generate
                                    detailed reports.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center p-8">
                            <CardContent className="space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold">Invoicing</h3>
                                <p className="text-gray-600">
                                    Create professional invoices in seconds. Set recurring invoices and get paid faster
                                    with online payments.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center p-8">
                            <CardContent className="space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold">Financial Insights</h3>
                                <p className="text-gray-600">
                                    Visualize your income, expenses, and profitability with intuitive dashboards and
                                    reports.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Features
                                    </a>
                                </li>

                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Updates
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Community
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Guides
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Freelance HQ</span>
                            <span className="text-gray-500">© 2024 All rights reserved</span>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-5 h-5 bg-gray-400 rounded"></div>
                            <div className="w-5 h-5 bg-gray-400 rounded"></div>
                            <div className="w-5 h-5 bg-gray-400 rounded"></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

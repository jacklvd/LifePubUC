import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/icons'

interface StatsOverviewProps {
    events?: Event[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ events = [] }) => {
    // Count total events
    const totalEvents = events.length;

    // Count upcoming events (events with date in the future)
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of today
        return eventDate >= today && event.status === 'on sale';
    }).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border-none">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Events</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalEvents}</h3>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Icon name="Calendar" className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-purple-50 border-none">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Upcoming Events</p>
                            <h3 className="text-2xl font-bold text-gray-800">{upcomingEvents}</h3>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-full">
                            <Icon name="Clock" className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-none">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Products</p>
                            <h3 className="text-2xl font-bold text-gray-800">12</h3>
                        </div>
                        <div className="bg-amber-100 p-2 rounded-full">
                            <Icon name="ShoppingCart" className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-green-50 border-none">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Sales</p>
                            <h3 className="text-2xl font-bold text-gray-800">$1,240</h3>
                        </div>
                        <div className="bg-green-100 p-2 rounded-full">
                            <Icon name="TrendingUp" className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default StatsOverview
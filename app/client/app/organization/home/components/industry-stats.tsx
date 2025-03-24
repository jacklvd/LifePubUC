import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/icons'

const IndustryStats: React.FC = () => {
    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                LifePub helps <span className="text-purple-700">comedy</span>{' '}
                organizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-800">
                                    5.3M
                                </span>
                                <div className="bg-red-100 p-1 rounded">
                                    <Icon name="TicketIcon" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                tickets sold for comedy events
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-800">
                                    2M
                                </span>
                                <div className="bg-white p-1 rounded">
                                    <Icon name="UserIcon" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                people bought tickets to comedy events
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-800">
                                    728.2K
                                </span>
                                <div className="bg-white p-1 rounded">
                                    <Icon name="SearchIcon" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                searches for comedy events
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-800">
                                    45%
                                </span>
                                <div className="bg-white p-1 rounded">
                                    <Icon name="TrendingUp" className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                average profit margin
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default IndustryStats
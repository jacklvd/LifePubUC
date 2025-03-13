import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Icon } from '@/components/icons'

const Additional = () => {
    return (
        <>
            <div className="mb-6">
                <div className="relative rounded-md overflow-hidden border bg-white p-6">
                    <h3 className="text-lg font-medium mb-4">Good to know</h3>

                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Highlights</h4>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-md">
                                <Icon name="Plus" className="h-4 w-4 mr-1" />
                                <span>Add Age info</span>
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-md">
                                <Icon name="Plus" className="h-4 w-4 mr-1" />
                                <span>Add Door Time</span>
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-md">
                                <Icon name="Plus" className="h-4 w-4 mr-1" />
                                <span>Add Parking info</span>
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Frequently asked questions</h4>
                        <div className="border rounded-md p-3 mb-2 flex items-center">
                            <Icon name="Info" className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">
                                Events with FAQs have 8% more organic traffic
                            </span>
                        </div>
                        <Button variant="link" className="text-blue-500 p-0">
                            <Icon name="Plus" className="h-4 w-4 mr-1" />
                            <span>Add question</span>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
                    >
                        <Icon name="Plus" className="h-4 w-4" />
                    </Button>
                </div>
            </div>


            <div className="mb-6">
                <div className="relative rounded-md overflow-hidden border bg-white p-6">
                    <h3 className="text-lg font-medium mb-4">
                        Add more sections to your event page
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Make your event stand out even more. These sections help
                        attendees find information and answer their questions - which
                        means more ticket sales and less time answering messages.
                    </p>

                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        Recommended
                    </Badge>
                </div>
            </div>
        </>
    )
}

export default Additional
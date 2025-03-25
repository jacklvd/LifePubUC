import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Newsletter = () => {
    return (
        <div className="bg-blue-50 rounded-lg p-6 mb-10">
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Never miss an event</h3>
                <p className="text-gray-600 mb-4">Subscribe to our newsletter for personalized event recommendations</p>
                <div className="flex max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Your email address"
                        className="rounded-r-none border-r-0 focus:ring-blue-500 flex-1"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none">
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Newsletter
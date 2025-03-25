// app/components/landing/CreatorCTA.jsx
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CreatorCTA = () => {
    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 mb-10 text-white shadow-lg">
            <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Create your own event</h3>
                    <p className="text-white/80">Share your passion with our community and reach thousands of attendees</p>
                </div>
                <Link href="/organization/onboarding">
                    <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6 py-2">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default CreatorCTA
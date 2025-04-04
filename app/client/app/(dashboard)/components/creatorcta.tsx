import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarPlus } from 'lucide-react'

const CreatorCTA: React.FC = () => {
  return (
    <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white-100">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Host your own event</h2>
          <p className="text-blue-100 max-w-xl">
            Ready to bring people together? Create and promote your event on our platform.
            Whether it&apos;s a workshop, performance, or gathering, we&apos;ll help you succeed.
          </p>
        </div>

        <Link href="/organization/events/home" className="shrink-0">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white-100 text-blue-600 hover:bg-blue-50"
          >
            <CalendarPlus className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CreatorCTA
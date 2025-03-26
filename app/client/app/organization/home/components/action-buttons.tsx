import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/icons'

const ActionButtons: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/organization/events/create" passHref>
          <Card className="bg-purple-50 border-none cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-full">
                  <Icon name="Calendar" className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Create an Event
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Set up tickets, seating, and event details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/organization/items" passHref>
          <Card className="bg-amber-50 border-none cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-full">
                  <Icon
                    name="ShoppingCart"
                    className="h-5 w-5 text-amber-600"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Add New Product
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Create merchandise or digital goods to sell
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/organization/reports" passHref>
          <Card className="bg-blue-50 border-none cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-full">
                  <Icon name="TrendingUp" className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    View Analytics
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Track performance of events and products
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default ActionButtons

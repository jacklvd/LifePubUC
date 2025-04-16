import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'

interface EmptyStateProps {
  statusFilter: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ statusFilter }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-400" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No listings found
        </h3>

        <p className="text-gray-500 mb-6">
          {statusFilter !== 'all'
            ? `You don't have any ${statusFilter} listings yet.`
            : "You haven't created any listings yet."}
        </p>

        <Button asChild>
          <Link href="/organization/items/create">
            Create your first listing
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default EmptyState

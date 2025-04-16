import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash, CheckCircle, Clock } from 'lucide-react'

interface BulkActionsProps {
  visible: boolean
  onMarkAsActive: () => void
  onMarkAsSold: () => void
  onMarkAsReserved: () => void
  onDelete: () => void
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  visible,
  onMarkAsActive,
  onMarkAsSold,
  onMarkAsReserved,
  onDelete,
}) => {
  if (!visible) return null

  return (
    <div className="py-4 border-t flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={onMarkAsActive}
        className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Mark as Active
      </Button>

      <Button
        variant="secondary"
        onClick={onMarkAsSold}
        className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Mark as Sold
      </Button>

      <Button
        variant="secondary"
        onClick={onMarkAsReserved}
        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
      >
        <Clock className="h-4 w-4 mr-2" />
        Mark as Reserved
      </Button>

      <Button variant="destructive" onClick={onDelete}>
        <Trash className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  )
}

export default BulkActions

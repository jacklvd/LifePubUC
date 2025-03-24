// components/ui/ticket-ui/empty-ticket-state.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '../icons'

interface EmptyTicketStateProps {
  onAddClick: () => void
}

const EmptyTicketState: React.FC<EmptyTicketStateProps> = ({ onAddClick }) => {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
        <p className="text-gray-500 mb-4">No tickets have been created yet</p>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={onAddClick}
        >
          <Icon name="Plus" className="h-4 w-4 mr-2" /> Create your first ticket
        </Button>
      </CardContent>
    </Card>
  )
}

export default EmptyTicketState

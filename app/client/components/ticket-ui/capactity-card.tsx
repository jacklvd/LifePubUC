// components/ui/ticket-ui/capacity-card.tsx
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CapacityCardProps {
    tickets: Ticket[]
    totalCapacity: number
    onEditCapacity: () => void
}

const CapacityCard: React.FC<CapacityCardProps> = ({
    tickets,
    totalCapacity,
    onEditCapacity
}) => {
    return (
        <Card>
            <CardContent className="pt-6 ">
                <div className="flex justify-between items-center ">
                    <div className="flex items-center gap-2">
                        <span>Event capacity</span>
                        <span className="text-gray-500 text-sm cursor-help">ⓘ</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            {tickets.reduce((acc, ticket) => acc + ticket.sold, 0)} / {totalCapacity}
                        </span>
                        <Button
                            variant="link"
                            className="text-blue-600 text-sm p-0"
                            onClick={onEditCapacity}
                        >
                            Edit capacity
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CapacityCard
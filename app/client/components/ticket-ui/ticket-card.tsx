// components/ui/ticket-ui/ticket-card.tsx
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TicketCardProps {
    ticket: Ticket
    formatTicketDate: (date: Date) => string
    onEdit: (ticket: Ticket) => void
    onDelete: (ticket: Ticket) => void
}

const TicketCard: React.FC<TicketCardProps> = ({
    ticket,
    formatTicketDate,
    onEdit,
    onDelete
}) => {
    return (
        <Card key={ticket.id}>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">{ticket.name}</h3>
                                <p className="text-sm text-gray-500">
                                    On Sale • Ends {formatTicketDate(ticket.saleEnd)} at {ticket.endTime}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-2 text-sm">
                                    <span className="font-semibold">Sold:</span> {ticket.sold}/{ticket.capacity}
                                </div>
                                <div className="mr-4 text-sm">
                                    <span className="text-sm text-gray-500">
                                        {ticket.type === 'Free'
                                            ? 'Free'
                                            : ticket.type === 'Donation'
                                                ? 'Donation'
                                                : `$${ticket.price?.toFixed(2)}`}
                                    </span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className='bg-white-100'>
                                        <DropdownMenuItem onClick={() => onEdit(ticket)}>
                                            Edit ticket
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => onDelete(ticket)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TicketCard
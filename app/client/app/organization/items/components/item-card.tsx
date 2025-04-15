import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Eye, ChevronDown, ImageIcon } from 'lucide-react'

interface ItemCardProps {
    item: Item
    selectionMode: boolean
    isSelected: boolean
    onSelect: (itemId: string) => void
    onUpdateStatus: (itemId: string, status: 'available' | 'sold' | 'reserved') => void
    onDelete: (itemId: string) => void
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'available':
            return 'bg-green-100 text-green-800 hover:bg-green-200'
        case 'sold':
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        case 'reserved':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'available':
            return 'Active'
        case 'sold':
            return 'Sold'
        case 'reserved':
            return 'Reserved'
        default:
            return status
    }
}

export const ItemCard: React.FC<ItemCardProps> = ({
    item,
    selectionMode,
    isSelected,
    onSelect,
    onUpdateStatus,
    onDelete
}) => {
    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <div className="relative w-full h-48 bg-gray-100">
                {selectionMode && (
                    <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onSelect(item._id)}
                            className="h-5 w-5 border-2"
                        />
                    </div>
                )}

                {item.images && item.images.length > 0 ? (
                    <Image
                        src={item.images[0]}
                        alt={item.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                )}

                <Badge
                    className={`absolute top-3 right-3 ${getStatusBadgeClass(item.status)}`}
                    variant="outline"
                >
                    {getStatusLabel(item.status)}
                </Badge>
            </div>

            <CardContent className="pt-6 flex-grow">
                <Link href={`/items/${item._id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-orange-500 line-clamp-1 mb-2">
                        {item.title}
                    </h3>
                </Link>

                <div className="flex justify-between items-center mb-3">
                    <p className="text-lg font-semibold text-gray-900">
                        ${item.price.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.views}
                    </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Badge variant="secondary" className="mr-2">
                        {item.category || 'Uncategorized'}
                    </Badge>
                    <span>
                        Added {format(new Date(item?.createdAt), 'MMM d, yyyy')}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="border-t pt-3 flex flex-wrap gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 flex items-center">
                        Status <ChevronDown className="w-4 h-4 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-white-100'>
                        <DropdownMenuItem onClick={() => onUpdateStatus(item._id, 'available')}>
                            Mark as Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(item._id, 'sold')}>
                            Mark as Sold
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(item._id, 'reserved')}>
                            Mark as Reserved
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link
                    href={`/organization/items/edit/${item._id}`}
                    className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                >
                    Edit
                </Link>

                <button
                    onClick={() => onDelete(item._id)}
                    className="text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
                >
                    Delete
                </button>
            </CardFooter>
        </Card>
    )
}

export default ItemCard
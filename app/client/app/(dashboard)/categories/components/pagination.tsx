import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  const pageNumbers = []

  // Determine which page numbers to show
  const maxVisiblePages = 5

  if (totalPages <= maxVisiblePages) {
    // If total pages is less than max visible, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    // Always include first and last page
    pageNumbers.push(1)

    // Calculate start and end of the visible page range
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Adjust start and end to always show maxVisiblePages - 2 pages (excluding first and last)
    const visibleCount = end - start + 1
    if (visibleCount < maxVisiblePages - 2) {
      if (start === 2) {
        end = Math.min(
          totalPages - 1,
          end + (maxVisiblePages - 2 - visibleCount),
        )
      } else if (end === totalPages - 1) {
        start = Math.max(2, start - (maxVisiblePages - 2 - visibleCount))
      }
    }

    // Add ellipsis if needed
    if (start > 2) {
      pageNumbers.push('...')
    }

    // Add middle page numbers
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pageNumbers.push('...')
    }

    // Add the last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{' '}
          to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
          items
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Items per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="12" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
              <SelectItem value="96">96</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-l-md rounded-r-none"
          >
            <Icon name="ChevronLeft" width={16} />
          </Button>

          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 h-8 flex items-center justify-center text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => onPageChange(page)}
                  className={`h-8 w-8 ${index === 0 ? 'rounded-l-none' : ''} ${
                    index === pageNumbers.length - 1 ? 'rounded-r-none' : ''
                  } ${
                    index !== 0 && index !== pageNumbers.length - 1
                      ? 'rounded-none border-l-0'
                      : ''
                  } ${index === pageNumbers.length - 1 ? 'border-l-0' : ''}`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 rounded-r-md rounded-l-none border-l-0"
          >
            <Icon name="ChevronRight" width={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pagination

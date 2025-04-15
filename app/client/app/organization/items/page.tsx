'use client'

import { useState, useEffect } from 'react'
import { deleteItem, getItemsForSeller } from '@/lib/actions/item-actions'
import {
  Header,
  FiltersToolbar,
  BulkActions,
  ItemsList,
  Pagination,
  EmptyState,
  LoadingState,
  ErrorDisplay
} from './components'

const ItemManagementDashboard = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>('-createdAt')

  useEffect(() => {
    fetchItems()
  }, [currentPage, statusFilter, sortBy])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await getItemsForSeller({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        sort: sortBy,
        q: searchQuery || undefined,
      })

      setItems(response.data)
      setTotalPages(response.pagination.pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchItems()
  }

  const handleUpdateStatus = async (
    itemId: string,
    newStatus: 'available' | 'sold' | 'reserved',
  ) => {
    try {
      const response = await fetch(`/api/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update item status')
      }
      setItems(
        items.map((item) =>
          item._id === itemId ? { ...item, status: newStatus } : item,
        ),
      )
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem({ itemId: itemId })
      setItems(items.filter((item) => item._id !== itemId))
    } catch (err) {
      console.error('Error deleting item:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  const toggleSelectItem = (itemId: string) => {
    const newSelectedItems = new Set(selectedItems)

    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId)
    } else {
      newSelectedItems.add(itemId)
    }

    setSelectedItems(newSelectedItems)
  }

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    setSelectedItems(new Set())
  }

  const selectAllItems = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map((item) => item._id)))
    }
  }

  const bulkUpdateStatus = async (
    newStatus: 'available' | 'sold' | 'reserved',
  ) => {
    if (selectedItems.size === 0) {
      return
    }

    try {
      const itemIds = Array.from(selectedItems)

      await Promise.all(
        itemIds.map((id) =>
          fetch(`/api/items/${id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          }),
        ),
      )

      setItems(
        items.map((item) =>
          selectedItems.has(item._id) ? { ...item, status: newStatus } : item,
        ),
      )

      setSelectedItems(new Set())
    } catch (err) {
      console.error('Error in bulk update:', err)
      setError(err instanceof Error ? err.message : 'Failed to update items')
    }
  }

  const bulkDeleteItems = async () => {
    if (selectedItems.size === 0) {
      return
    }

    try {
      const itemIds = Array.from(selectedItems)

      // Delete each selected item
      await Promise.all(
        itemIds.map((id) => deleteItem({ itemId: id }))
      )

      setItems(items.filter((item) => !selectedItems.has(item._id)))
      setSelectedItems(new Set())
    } catch (err) {
      console.error('Error in bulk delete:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete items')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <Header
        title="Listings"
        createButtonLink="/organization/items/create"
        createButtonText="Create new listing"
      />

      {/* Filters and controls */}
      <FiltersToolbar
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        sortBy={sortBy}
        selectionMode={selectionMode}
        selectedCount={selectedItems.size}
        onStatusFilterChange={setStatusFilter}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onSortByChange={setSortBy}
        onToggleSelectionMode={toggleSelectionMode}
        onSelectAll={selectAllItems}
        allSelected={selectedItems.size === items.length && items.length > 0}
      />

      {/* Bulk actions */}
      <BulkActions
        visible={selectionMode && selectedItems.size > 0}
        onMarkAsActive={() => bulkUpdateStatus('available')}
        onMarkAsSold={() => bulkUpdateStatus('sold')}
        onMarkAsReserved={() => bulkUpdateStatus('reserved')}
        onDelete={bulkDeleteItems}
      />

      {/* Error message */}
      <ErrorDisplay message={error} />

      {/* Content area */}
      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState statusFilter={statusFilter} />
      ) : (
        <>
          {/* Items grid/list */}
          <ItemsList
            items={items}
            selectionMode={selectionMode}
            selectedItems={selectedItems}
            onSelectItem={toggleSelectItem}
            onUpdateStatus={handleUpdateStatus}
            onDeleteItem={handleDeleteItem}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default ItemManagementDashboard
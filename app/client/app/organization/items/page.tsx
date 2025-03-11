"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';

interface ApiResponse {
    message: string;
    data: Item[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

const ItemManagementDashboard = () => {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>('-createdAt');

    useEffect(() => {
        fetchItems();
    }, [currentPage, statusFilter, sortBy]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let url = `/api/items?page=${currentPage}&sort=${sortBy}`;

            if (statusFilter !== 'all') {
                url += `&status=${statusFilter}`;
            }

            if (searchQuery) {
                url += `&q=${encodeURIComponent(searchQuery)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }

            const data: ApiResponse = await response.json();
            setItems(data.data);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchItems();
    };

    const handleUpdateStatus = async (itemId: string, newStatus: 'available' | 'sold' | 'reserved') => {
        try {
            const response = await fetch(`/api/items/${itemId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item status');
            }
            setItems(items.map(item =>
                item._id === itemId
                    ? { ...item, status: newStatus }
                    : item
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err instanceof Error ? err.message : 'Failed to update status');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            setItems(items.filter(item => item._id !== itemId));
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete item');
        }
    };

    const toggleSelectItem = (itemId: string) => {
        const newSelectedItems = new Set(selectedItems);

        if (newSelectedItems.has(itemId)) {
            newSelectedItems.delete(itemId);
        } else {
            newSelectedItems.add(itemId);
        }

        setSelectedItems(newSelectedItems);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedItems(new Set());
    };

    const selectAllItems = () => {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(items.map(item => item._id)));
        }
    };

    const bulkUpdateStatus = async (newStatus: 'available' | 'sold' | 'reserved') => {
        if (selectedItems.size === 0) {
            return;
        }

        try {
            const itemIds = Array.from(selectedItems);

            // In a real implementation, you'd likely have a bulk update endpoint
            // For this example, we'll update each item individually
            await Promise.all(
                itemIds.map(id =>
                    fetch(`/api/items/${id}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: newStatus }),
                    })
                )
            );

            // Update items in local state
            setItems(items.map(item =>
                selectedItems.has(item._id)
                    ? { ...item, status: newStatus }
                    : item
            ));

            setSelectedItems(new Set());
        } catch (err) {
            console.error('Error in bulk update:', err);
            setError(err instanceof Error ? err.message : 'Failed to update items');
        }
    };

    const bulkDeleteItems = async () => {
        if (selectedItems.size === 0) {
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
            return;
        }

        try {
            const itemIds = Array.from(selectedItems);

           
            await Promise.all(
                itemIds.map(id =>
                    fetch(`/api/items/${id}`, {
                        method: 'DELETE',
                    })
                )
            );

            setItems(items.filter(item => !selectedItems.has(item._id)));

            setSelectedItems(new Set());
        } catch (err) {
            console.error('Error in bulk delete:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete items');
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'sold':
                return 'bg-gray-100 text-gray-800';
            case 'reserved':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Listings</h1>
                <Link href="/organization/items/create">
                    <p className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create new listing
                    </p>
                </Link>
            </div>

            {/* Filters and controls */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded border ${statusFilter === 'all' ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('available')}
                            className={`px-4 py-2 rounded border ${statusFilter === 'available' ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setStatusFilter('sold')}
                            className={`px-4 py-2 rounded border ${statusFilter === 'sold' ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                        >
                            Sold
                        </button>
                        <button
                            onClick={() => setStatusFilter('reserved')}
                            className={`px-4 py-2 rounded border ${statusFilter === 'reserved' ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                        >
                            Reserved
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search your listings"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded-l px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 text-white rounded-r px-4 py-2 hover:bg-orange-600"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center gap-2 mb-4 sm:mb-0">
                        <button
                            onClick={toggleSelectionMode}
                            className={`px-4 py-2 rounded border ${selectionMode ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
                        >
                            {selectionMode ? 'Cancel' : 'Select'}
                        </button>

                        {selectionMode && (
                            <>
                                <button
                                    onClick={selectAllItems}
                                    className="px-4 py-2 rounded border border-gray-200"
                                >
                                    {selectedItems.size === items.length ? 'Deselect all' : 'Select all'}
                                </button>
                                <div className="flex items-center text-sm text-gray-600">
                                    {selectedItems.size} selected
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center">
                        <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="-createdAt">Newest</option>
                            <option value="createdAt">Oldest</option>
                            <option value="-views">Most views</option>
                            <option value="price.amount">Price: Low to high</option>
                            <option value="-price.amount">Price: High to low</option>
                            <option value="title">Title: A-Z</option>
                            <option value="-title">Title: Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Bulk actions */}
                {selectionMode && selectedItems.size > 0 && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                        <button
                            onClick={() => bulkUpdateStatus('available')}
                            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                        >
                            Mark as Active
                        </button>
                        <button
                            onClick={() => bulkUpdateStatus('sold')}
                            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Mark as Sold
                        </button>
                        <button
                            onClick={() => bulkUpdateStatus('reserved')}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Mark as Reserved
                        </button>
                        <button
                            onClick={bulkDeleteItems}
                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-2 text-gray-500">Loading your listings...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No listings found</h3>
                    <p className="text-gray-500 mb-6">
                        {statusFilter !== 'all'
                            ? `You don't have any ${statusFilter} listings yet.`
                            : "You haven't created any listings yet."}
                    </p>
                    <Link href="/organization/items/create">
                        <p className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition-colors">
                            Create your first listing
                        </p>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Items grid/list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 relative">
                                {selectionMode && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(item._id)}
                                            onChange={() => toggleSelectItem(item._id)}
                                            className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                )}

                                <div className="relative w-full h-48 bg-gray-100">
                                    {item.images && item.images.length > 0 ? (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                                        {item.status === 'available' ? 'Active' :
                                            item.status === 'sold' ? 'Sold' : 'Reserved'}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <Link href={`/items/${item._id}`}>
                                        <p className="text-lg font-medium text-gray-900 hover:text-orange-500 line-clamp-1 mb-1">
                                            {item.title}
                                        </p>
                                    </Link>

                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${item.price.amount.toFixed(2)}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {item.views}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-3">
                                        <span className="bg-gray-100 rounded px-2 py-1 mr-2">{item.category || ""}</span>
                                        <span>Added {format(new Date(item?.createdAt | ""), 'MMM d, yyyy')}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                                        <div className="relative group">
                                            <button
                                                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                                            >
                                                Status
                                                <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className="absolute z-10 left-0 mt-1 w-40 bg-white rounded shadow-lg border border-gray-200 invisible group-hover:visible">
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'available')}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    Mark as Active
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'sold')}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    Mark as Sold
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'reserved')}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    Mark as Reserved
                                                </button>
                                            </div>
                                        </div>

                                        <Link href={`/organization/items/edit/${item._id}`}>
                                            <p className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                                                Edit
                                            </p>
                                        </Link>

                                        <button
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded mr-1 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 mx-1 rounded ${page === currentPage
                                                ? 'bg-orange-500 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded ml-1 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemManagementDashboard;
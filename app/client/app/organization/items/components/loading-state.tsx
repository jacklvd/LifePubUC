import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingState: React.FC = () => {
    return (
        <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-orange-500" />
            <p className="mt-4 text-gray-500">Loading your listings...</p>
        </div>
    )
}

export default LoadingState
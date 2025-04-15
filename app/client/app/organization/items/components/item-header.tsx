import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface HeaderProps {
    title: string
    createButtonLink: string
    createButtonText: string
}

const Header: React.FC<HeaderProps> = ({
    title,
    createButtonLink,
    createButtonText
}) => {
    return (
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">{title}</h1>
            <Button asChild>
                <Link href={createButtonLink} className="flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    {createButtonText}
                </Link>
            </Button>
        </div>
    )
}

export default Header
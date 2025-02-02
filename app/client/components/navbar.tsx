"use client";

import Link from 'next/link'
import React from 'react'
import { Search, ShoppingCart, Bell, Heart } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const Navbar = () => {
    return (
        <nav className="w-full text-primary border-b border-b-customgreys-dirtyGrey border-[0.2px]">
            <div className='max-w-7xl mx-auto flex justify-between items-center px-4 py-3 '>
                {/* LOGO */}
                <Link href="/" className="text-2xl font-bold transition-colors">
                    Educative
                </Link>

                {/* SEARCH */}
                <div className="flex-1 max-w-3xl mx-5">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search items..."
                            className="w-full bg-white text-black text-md
                                     focus:border-secondary-300 focus:ring-secondary-200"
                        />
                        <Search className="absolute right-3 top-2.5 h-5 w-5" />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className='flex items-center gap-6'>
                    <TooltipProvider >
                        <Tooltip delayDuration={100} >
                            <TooltipTrigger className=''>
                                <Link href="" className="relative">
                                    <div className='p-2 hover:bg-primary-50 hover:rounded-full transition-all'>
                                        <Heart className="h-6 w-6" />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className='bg-primary-500 text-sm px-3'>
                                Favorite
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider >
                        <Tooltip delayDuration={100} >
                            <TooltipTrigger className=''>
                                <Link href="" className="relative">
                                    <div className='p-2 hover:bg-primary-50 hover:rounded-full transition-all'>
                                        <Bell className="h-6 w-6" />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className='bg-primary-500 text-sm px-3'>
                                Notification
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider >
                        <Tooltip delayDuration={100} >
                            <TooltipTrigger className=''>
                                <Link href="" className="relative">
                                    <Avatar className="h-9 w-9 hover:ring-2 hover:ring-secondary-300 hover:bg-primary-50 hover:rounded-full transition-all">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback className="bg-primary-300">CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className='bg-primary-500 text-sm px-3'>
                                Profile
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider >
                        <Tooltip delayDuration={100} >
                            <TooltipTrigger className=''>
                                <Link href="/cart" className="relative">
                                    <div className='p-2 hover:bg-primary-50 hover:rounded-full transition-all'>
                                        <ShoppingCart className="h-6 w-6" />
                                        <span className="absolute -top-2 -right-2 bg-primary-500 text-white-100  text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            0
                                        </span>
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className='bg-primary-500 text-sm px-3'>
                                Cart
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
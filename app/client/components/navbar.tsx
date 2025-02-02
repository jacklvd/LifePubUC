"use client";

import Link from 'next/link'
import React from 'react'
import { Search, ShoppingCart, User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const Navbar = () => {
    return (
        <nav className="w-full text-primary border-b border-b-customgreys-dirtyGrey border-[0.2px]">
            <div className='max-w-7xl mx-auto flex justify-between items-center px-4 py-3 '>
                {/* LOGO */}
                <Link href="/" className="text-2xl font-bold transition-colors">
                    Educative
                </Link>

                {/* SEARCH */}
                <div className="flex-1 max-w-2xl mx-12">
                    <div className="relative">
                        <Input 
                            type="text"
                            placeholder="Search items..."
                            className="w-full bg-primary-100 border-primary-300 text-white
                                     focus:border-secondary-300 focus:ring-secondary-200"
                        />
                        <Search className="absolute right-3 top-2.5 h-5 w-5" />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className='flex items-center gap-6'>
                    <Popover>
                        <PopoverTrigger>
                            <Avatar className="h-9 w-9 hover:ring-2 hover:ring-secondary-300 transition-all">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="bg-primary-300">CN</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 bg-primary-500 border-primary-400 text-white">
                            <div className="flex flex-col space-y-1">
                                <Link href="/profile" 
                                      className="flex items-center gap-2 p-2 hover:bg-primary-400 rounded-md transition-colors">
                                    <User size={16} />
                                    Profile
                                </Link>
                                <Link href="/orders" 
                                      className="p-2 hover:bg-primary-400 rounded-md transition-colors">
                                    Orders
                                </Link>
                                <Link href="/settings" 
                                      className="p-2 hover:bg-primary-400 rounded-md transition-colors">
                                    Settings
                                </Link>
                                <hr className="border-primary-400" />
                                <button className="p-2 text-left hover:bg-primary-400 rounded-md transition-colors text-primary-100">
                                    Sign out
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Link href="/cart" className="relative hover:text-secondary-200 transition-colors">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 bg-secondary-300 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
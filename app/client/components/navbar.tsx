'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { signOutUser } from '@/lib/actions/auth'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useCartStore } from '@/store/cart'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'
import { Icon } from './icons'
import { navbarIcons } from '@/constants'
import { slide as Menu } from 'react-burger-menu'
import { Twirl as Hamburger } from 'hamburger-react'

// Custom styles for the burger menu - fixed TypeScript error by using strings for all values
const burgerStyles = {
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    top: '0', // Changed from number to string
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
    right: '16px',
    top: '16px',
  },
  bmCross: {
    background: '#000',
  },
  bmMenu: {
    background: 'white',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmMorphShape: {
    fill: '#373a47',
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
  },
  bmItem: {
    display: 'block',
  },
}

const Navbar = () => {
  const router = useRouter()
  const totalQuantity = useCartStore((state) => state.totalQuantity)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the menu when changing routes
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false)
    }

    // Clean up event listener when component unmounts
    return () => {
      handleRouteChange()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const result = await signOutUser()

      if (result.success) {
        router.push('/sign-in')
      } else {
        console.error('Sign out failed:', result.error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Fixes the issue with the logo clicks by ensuring menu doesn't interfere
  const handleLogoClick = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  return (
    <nav className="w-full text-primary border-b border-[0.2px]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* LOGO with click handler */}
        <Link
          href="/"
          className="text-2xl font-bold transition-colors z-10"
          onClick={handleLogoClick}
        >
          LifePub
        </Link>

        {/* SEARCH (Hidden on Small Screens) */}
        <div className="hidden md:flex flex-1 max-w-3xl mx-5">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search items..."
              className="w-full bg-white text-black text-md border border-r-8 rounded-full 
                         focus:border-secondary-300 focus:ring-secondary-200"
            />
            <Icon name="Search" className="absolute right-3 top-2.5 h-5 w-5" />
          </div>
        </div>

        {/* MOBILE MENU TOGGLE (Hamburger Menu) */}
        <div className="md:hidden flex items-center justify-end text-black ml-auto z-20">
          <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={24} />
        </div>

        {/* MOBILE MENU (Burger Menu) - Only visible on mobile */}
        <div className="md:hidden">
          <Menu
            right
            isOpen={menuOpen}
            onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
            styles={burgerStyles}
            width={'250px'}
            disableOverlayClick={false}
          >
            <div className="menu-items mt-8">
              {navbarIcons.map((icon, index) => (
                <Link
                  key={index}
                  href={icon.route}
                  className="menu-item block py-3 text-primary"
                >
                  <Icon
                    name={icon.name}
                    className="h-6 w-6 inline-block mr-2"
                  />
                  {icon.title}
                </Link>
              ))}
              <Link
                href="/cart"
                className="menu-item block py-3 relative text-primary"
              >
                <Icon
                  name="ShoppingCart"
                  className="h-6 w-6 inline-block mr-2"
                />
                Cart
                <span className="absolute top-3 ml-1 bg-primary-500 text-white-100 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity || '0'}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="menu-item block py-3 text-primary"
              >
                <Icon name="LogOut" className="h-6 w-6 inline-block mr-2" />
                Sign out
              </button>
            </div>
          </Menu>
        </div>

        {/* ACTION ICONS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <TooltipProvider>
            {navbarIcons.map((icon, index) => {
              return (
                <Tooltip key={index} delayDuration={100}>
                  <TooltipTrigger>
                    <Link href={icon.route} className="relative">
                      <div className="p-2 rounded-full transition-all hover:bg-gray-200">
                        <Icon name={icon.name} className={icon.className} />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-500 text-sm px-3">
                    {icon.title}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Link href="" className="relative">
                <Avatar className="h-9 w-9 hover:ring-2 hover:ring-secondary-300 hover:bg-primary-50 hover:rounded-full transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-primary-300">CN</AvatarFallback>
                </Avatar>
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-primary-500 text-white-100">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="">
                <Link href="/cart" className="relative">
                  <div className="p-2 hover:bg-primary-50 hover:rounded-full transition-all">
                    <Icon name="ShoppingCart" className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white-100 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQuantity || '0'}
                    </span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-primary-500 text-sm px-3">
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

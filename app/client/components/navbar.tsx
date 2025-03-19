/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { signOutUser } from '@/lib/actions/auth-actions'

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
import { useRouter, usePathname } from 'next/navigation'
import { Icon } from './icons'
import { navbarIcons } from '@/constants'
import { slide as Menu } from 'react-burger-menu'
import { Twirl as Hamburger } from 'hamburger-react'

// Custom styles for the burger menu - adjusted for sidebar
const burgerStyles = {
  // bmBurgerButton: {
  //   display: "none", // Hide the default burger button
  // },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.1)', // Dark background
    zIndex: '100', // Ensure menu is above content
  },
  bmMenu: {
    background: '#edf6f9',
    padding: '2.5rem 1.5rem 1.5rem',
    fontSize: '1rem',
    // width: "calc(100vw - 130px)", // Adjust for sidebar width
    maxWidth: '280px',
    // boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
    zIndex: '101', // Ensure it's above overlay
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    top: '74px',
    transition: '0.3s',
  },
  // bmItemList: {
  //   padding: "0px",
  // },
  bmItem: {
    display: 'block',
    padding: '0.8rem 0',
    outline: 'none',
  },
  // // bmCrossButton: {
  // //   display: "none",
  // // },
}

const Navbar = () => {
  const router = useRouter()
  const totalQuantity = useCartStore((state) => state.totalQuantity)
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Handle body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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

  const handleLogoClick = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }

  const handleMenuStateChange = (state: any) => {
    setMenuOpen(state.isOpen)
  }

  return (
    <nav className="w-full text-primary border-b border-[0.2px]">
      <div className="flex justify-between items-center px-4 py-3">
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
        <div className="md:hidden flex items-center justify-end text-black ml-auto z-[102]">
          <Hamburger
            toggled={menuOpen}
            toggle={setMenuOpen}
            size={24}
            distance="md"
            rounded
          />
        </div>

        {/* MOBILE MENU (Burger Menu) - Only visible on mobile */}
        <div className="md:hidden">
          <Menu
            right
            isOpen={menuOpen}
            onStateChange={handleMenuStateChange}
            styles={burgerStyles}
            width={'250px'}
            customBurgerIcon={false}
            // customCrossIcon={false}
            pageWrapId={'page-wrap'}
            outerContainerId={'outer-container'}
            // Add noOverlay to handle our own overlay
            noOverlay
          >
            <div className="menu-items mt-4">
              <div className="relative w-full mb-6">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white text-black text-md border rounded-lg"
                />
                <Icon
                  name="Search"
                  className="absolute right-3 top-2.5 h-5 w-5"
                />
              </div>

              {navbarIcons.map((icon, index) => (
                <Link
                  key={index}
                  href={icon.route}
                  className="flex items-center py-3 text-primary hover:bg-primary-50 rounded-lg px-2 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {icon.title === 'Events' ? ( // Use a string, not the Event object
                    <div>
                      {/* <p>Become an Organizer</p> */}
                      <Icon
                        name={icon.name}
                        className="h-6 w-6 inline-block mr-2"
                      />
                    </div>
                  ) : (
                    <Icon name={icon.name} className="h-6 w-6 mr-3" />
                  )}

                  <span>{icon.title}</span>
                </Link>
              ))}

              <Link
                href="/cart"
                className="flex items-center py-3 text-primary hover:bg-primary-50 rounded-lg px-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <div className="relative">
                  <Icon name="ShoppingCart" className="h-6 w-6 mr-3" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white-100 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false)
                  handleSignOut()
                }}
                className="flex items-center w-full py-3 text-primary hover:bg-primary-50 rounded-lg px-2 transition-colors"
              >
                <Icon name="LogOut" className="h-6 w-6 mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </Menu>
        </div>

        {/* Create our own overlay since we're using noOverlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[99]"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* ACTION ICONS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <TooltipProvider>
            {navbarIcons.map((icon, index) => {
              return (
                <Tooltip key={index} delayDuration={100}>
                  <TooltipTrigger>
                    <Link href={icon.route} className="relative">
                      {icon.title === 'Events' ? (
                        <div className="p-2 text-md hover:font-normal flex flex-row gap-3 rounded-full transition-all bg-primary-50">
                          <p className="text-md">Create Events</p>
                          <Icon name={icon.name} className={icon.className} />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full transition-all hover:bg-primary-50">
                          <Icon name={icon.name} className={icon.className} />
                        </div>
                      )}
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
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="">
                <Link href="/checkout" className="relative">
                  <div className="p-2 hover:bg-primary-50 hover:rounded-full transition-all">
                    <Icon name="ShoppingCart" className="h-6 w-6" />
                    {totalQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-500 text-white-100 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalQuantity}
                      </span>
                    )}
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

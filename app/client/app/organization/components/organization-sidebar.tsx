'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/icons'
import { eventSideBarIcons } from '@/constants'
import { useRouter, usePathname } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/context/onboarding'

const OrganizationSideBar = () => {
  const router = useRouter()
  const pathname = usePathname() // get current route
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isOnboarded, isLoading } = useOnboarding()

  const handleNavigation = (route: string) => {
    if (!isOnboarded && route !== '/organization/onboarding') {
      // If not onboarded, only allow navigation to onboarding page
      router.push('/organization/onboarding')
    } else {
      router.push(route)
    }
    setIsMobileMenuOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col items-center py-4 space-y-4 sm:space-y-6">
      <TooltipProvider>
        {eventSideBarIcons.map((icon, index) => {
          const isActive = pathname === icon.route // check if current route matches
          const isDisabled =
            !isOnboarded && icon.route !== '/organization/onboarding'

          return (
            <Tooltip key={index} delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleNavigation(icon.route)}
                  className={`
                    p-2 rounded-lg transition-all w-full sm:w-auto flex sm:justify-center items-center
                    ${isActive ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'}
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  disabled={isDisabled}
                  aria-label={icon.title}
                >
                  <Icon name={icon.name} className="h-5 w-5" />
                  <span className="sr-only">{icon.title}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="hidden sm:block"
              >
                {icon.title}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>

      {/* Show loading indicator if onboarding status is being checked */}
      {isLoading && (
        <div className="w-full text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile hamburger menu - only visible on small screens */}
      <div className="sm:hidden fixed bottom-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white-100 shadow-md"
            >
              <Icon name="SquareMenu" className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 max-w-[240px] bg-white-100">
            {/* Add SheetHeader and SheetTitle for accessibility */}
            <SheetHeader className="mb-6">
              <SheetTitle>Organization</SheetTitle>
              {!isOnboarded && !isLoading && (
                <p className="text-sm text-orange-500">
                  Complete onboarding to access all features
                </p>
              )}
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden sm:block w-16 bg-white-100 border-r border-gray-200 h-full overflow-auto">
        {sidebarContent}
      </div>
    </>
  )
}

export default OrganizationSideBar

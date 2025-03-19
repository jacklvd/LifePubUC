'use client'

import React from 'react'
import { Icon } from '@/components/icons'
import { eventSideBarIcons } from '@/constants'
import { useRouter, usePathname } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const OrganizationSideBar = () => {
  const router = useRouter()
  const pathname = usePathname() // get current route

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
      <div className="flex flex-col items-center space-y-6">
        <TooltipProvider>
          {eventSideBarIcons.map((icon, index) => {
            const isActive = pathname === icon.route // check if current route matches

            return (
              <Tooltip key={index} delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => router.push(icon.route)}
                    className={`
                                    p-2 rounded-lg transition-all
                                    ${isActive ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'}
                                `}
                    aria-label={icon.title}
                  >
                    <Icon name={icon.name} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  {icon.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}

export default OrganizationSideBar

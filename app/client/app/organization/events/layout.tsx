// In your layout.tsx file
'use client'

import { EventProgressProvider } from '@/context/event-context'

export default function EventLayout({ children }: { children: React.ReactNode }) {
    return (
        <EventProgressProvider>
            {children}
        </EventProgressProvider>
    )
}
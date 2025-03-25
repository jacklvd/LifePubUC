// app/components/landing/EventTabs.jsx
import React from 'react'

// Define the props for the EventTabs component
interface EventTabsProps {
    tabs: string[]
    activeTab: number
    setActiveTab: (tabIndex: number) => void
}

const EventTabs: React.FC<EventTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="relative mb-8">
            <div className="flex overflow-x-auto pb-4 scrollbar-thin">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`px-4 py-2 whitespace-nowrap cursor-pointer transition-all duration-300 ${index === activeTab
                                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                            }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventTabs
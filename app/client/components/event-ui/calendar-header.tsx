// CalendarHeader.tsx - Calendar navigation and view controls
import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { ViewType } from '@/constants'

interface CalendarHeaderProps {
    view: ViewType
    date: DateState
    showMonthSelector: boolean
    months: string[]
    fullMonths: string[]
    weekViewTitle: string
    setView: (view: ViewType) => void
    prevPeriod: () => void
    nextPeriod: () => void
    goToToday: () => void
    setShowMonthSelector: (show: boolean) => void
    setDate: React.Dispatch<React.SetStateAction<DateState>>
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    view,
    date,
    showMonthSelector,
    months,
    fullMonths,
    weekViewTitle,
    setView,
    prevPeriod,
    nextPeriod,
    goToToday,
    setShowMonthSelector,
    setDate,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <Button
                variant="ghost"
                className="text-blue-500"
                onClick={goToToday}
            >
                Today
            </Button>

            <div className="flex items-center gap-2 relative">
                <Button variant="ghost" size="icon" onClick={prevPeriod} className="h-9 w-9">
                    <Icon name="ChevronLeft" className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    className="text-base font-medium px-3"
                    onClick={() => setShowMonthSelector(!showMonthSelector)}
                >
                    {view === 'month'
                        ? `${fullMonths[date.month]} ${date.year}`
                        : weekViewTitle}
                </Button>

                <Button variant="ghost" size="icon" onClick={nextPeriod} className="h-9 w-9">
                    <Icon name="ChevronRight" className="h-4 w-4" />
                </Button>

                {showMonthSelector && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 bg-white-100 border border-gray-200 rounded-lg shadow-xl p-6 grid grid-cols-4 gap-6 w-[320px]">
                        {/* Year Navigation */}
                        <div className="col-span-4 flex justify-between items-center mb-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setDate((prev) => ({ ...prev, year: prev.year - 1 }))
                                }
                            >
                                <Icon name="ChevronLeft" className="h-5 w-5" />
                            </Button>

                            <span className="text-xl font-semibold">{date.year}</span>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setDate((prev) => ({ ...prev, year: prev.year + 1 }))
                                }
                            >
                                <Icon name="ChevronRight" className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Month Selection */}
                        {months.map((month, idx) => (
                            <Button
                                key={month}
                                variant="ghost"
                                size="lg"
                                className={`text-lg py-3 rounded-md transition-all duration-200 ${idx === date.month
                                    ? 'bg-blue-500 text-white-100 font-semibold'
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => {
                                    setDate((prev) => ({ ...prev, month: idx }))
                                    setShowMonthSelector(false)
                                }}
                            >
                                {month}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex pointer-events-auto">
                <Button
                    variant={view === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-l-md rounded-r-none `}
                    onClick={() => setView('month')}
                >
                    Month
                </Button>
                <Button
                    variant={view === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-r-md rounded-l-none `}
                    onClick={() => setView('week')}
                >
                    Week
                </Button>
            </div>
        </div>
    )
}
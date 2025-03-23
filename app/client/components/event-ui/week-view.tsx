// WeekView.tsx - Optimized weekly calendar view component
import React, { RefObject, useEffect, useState, useMemo, useCallback } from 'react'
import { getHoursOfDay, isPastDate, isSameDay, getEventColor, formatTime } from '@/lib/utils'

interface WeekDay {
    day: string
    date: number
    month: number
    year: number
    fullDate: Date
}

interface WeekViewProps {
    weekDays: WeekDay[]
    weekContainerRef: RefObject<HTMLDivElement>
    getEventsForDate: (year: number, month: number, day: number) => Event[]
    handleEventClick: (event: Event, e: React.MouseEvent) => void
}

// Time Column component to avoid re-renders
const TimeColumn = React.memo(({ hours }: { hours: string[] }) => {
    return (
        <>
            {hours.map((hour, hourIndex) => (
                <div key={hourIndex} className="w-[70px] h-14 border-b border-r text-xs text-right pr-2 pt-1 text-gray-500 flex-shrink-0">
                    {hour}
                </div>
            ))}
        </>
    )
})

TimeColumn.displayName = 'TimeColumn'

// Day Header component to avoid re-renders
const DayHeader = React.memo(({
    day,
    columnWidth,
    isPast,
    isToday
}: {
    day: WeekDay
    columnWidth: number
    isPast: boolean
    isToday: boolean
}) => {
    return (
        <div
            className={`py-2 text-center font-medium border-r flex-1
        ${isPast ? 'bg-gray-50 text-gray-500' : ''}
        ${isToday ? 'bg-blue-50' : ''}
      `}
            style={{ width: `${columnWidth}px` }}
        >
            <div className="text-sm">{day.day.substring(0, 3)}</div>
            <div
                className={`inline-flex items-center justify-center w-8 h-8 mt-1 
          ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}
        `}
            >
                {day.date}
            </div>
        </div>
    )
})

DayHeader.displayName = 'DayHeader'

// Time Cell component to avoid re-renders
const TimeCell = React.memo(({
    columnWidth,
    isPast,
    isNow
}: {
    columnWidth: number
    isPast: boolean
    isNow: boolean
}) => {
    return (
        <div
            className={`h-14 border-b border-r
        ${isPast ? 'bg-gray-50' : ''}
        ${isNow ? 'bg-blue-50' : ''}
      `}
            style={{ width: `${columnWidth}px` }}
        >
            {isNow && (
                <div className="w-full h-0.5 bg-blue-500 relative top-0"></div>
            )}
        </div>
    )
})

TimeCell.displayName = 'TimeCell'

// Event component to avoid re-renders
const EventItem = React.memo(({
    event,
    position,
    handleEventClick
}: {
    event: Event
    position: { top: number; height: number; left: number; width: number }
    handleEventClick: (event: Event, e: React.MouseEvent) => void
}) => {
    const onEventClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        handleEventClick(event, e)
    }, [event, handleEventClick])

    return (
        <div
            className={`absolute ${getEventColor(event.status)} text-white text-xs p-2 rounded overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                height: `${position.height}px`,
                width: `${position.width}px`,
                zIndex: 10
            }}
            onClick={onEventClick}
        >
            <div className="font-semibold truncate">{event.title}</div>
            <div className="text-xs opacity-90 truncate">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </div>
        </div>
    )
})

EventItem.displayName = 'EventItem'

// Main WeekView component
export const WeekView: React.FC<WeekViewProps> = React.memo(({
    weekDays,
    weekContainerRef,
    getEventsForDate,
    handleEventClick
}) => {
    const today = useMemo(() => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return now
    }, [])

    const hours = useMemo(() => getHoursOfDay(), [])
    const [columnWidth, setColumnWidth] = useState(0)
    const [currentTime, setCurrentTime] = useState<{ top: number }>({ top: 0 })

    // Calculate column width when component mounts or window is resized
    useEffect(() => {
        const calculateDimensions = () => {
            if (weekContainerRef.current) {
                const containerWidth = weekContainerRef.current.getBoundingClientRect().width
                // 70px for time column
                const newColumnWidth = Math.floor((containerWidth - 70) / 7)
                setColumnWidth(newColumnWidth)

                // Calculate current time position
                const currentHour = new Date().getHours()
                const currentMinute = new Date().getMinutes()
                const topPosition = currentHour * 56 + (currentMinute / 60) * 56
                setCurrentTime({ top: topPosition })
            }
        }

        calculateDimensions()

        // Debounced resize handler
        let resizeTimer: NodeJS.Timeout
        const handleResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(calculateDimensions, 100)
        }

        window.addEventListener('resize', handleResize)

        // Update current time indicator every minute
        const timer = setInterval(() => {
            const currentHour = new Date().getHours()
            const currentMinute = new Date().getMinutes()
            const topPosition = currentHour * 56 + (currentMinute / 60) * 56
            setCurrentTime({ top: topPosition })
        }, 60000)

        return () => {
            window.removeEventListener('resize', handleResize)
            clearInterval(timer)
            clearTimeout(resizeTimer)
        }
    }, [weekContainerRef])

    // Function to calculate event position in week view - memoized
    const calculateEventPosition = useCallback((event: Event, dayIndex: number) => {
        if (!event.startTime || !event.endTime || columnWidth <= 0) return null

        // Parse start and end times
        let startHour = 0
        let startMinute = 0
        let endHour = 0
        let endMinute = 0

        // Handle different time formats
        if (event.startTime.includes('AM') || event.startTime.includes('PM')) {
            const startMatch = event.startTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
            const endMatch = event.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i)

            if (startMatch && endMatch) {
                startHour = parseInt(startMatch[1])
                startMinute = parseInt(startMatch[2])
                const startPeriod = startMatch[3].toUpperCase()

                // Convert 12-hour to 24-hour format
                if (startPeriod === 'PM' && startHour < 12) startHour += 12
                if (startPeriod === 'AM' && startHour === 12) startHour = 0

                endHour = parseInt(endMatch[1])
                endMinute = parseInt(endMatch[2])
                const endPeriod = endMatch[3].toUpperCase()

                if (endPeriod === 'PM' && endHour < 12) endHour += 12
                if (endPeriod === 'AM' && endHour === 12) endHour = 0
            }
        } else {
            // Parse 24-hour format
            const startParts = event.startTime.split(':')
            const endParts = event.endTime.split(':')

            if (startParts.length >= 2 && endParts.length >= 2) {
                startHour = parseInt(startParts[0])
                startMinute = parseInt(startParts[1])
                endHour = parseInt(endParts[0])
                endMinute = parseInt(endParts[1])
            }
        }

        // Calculate top position (where event starts)
        const hourHeight = 56 // Height per hour in pixels
        const top = (startHour * hourHeight) + ((startMinute / 60) * hourHeight)

        // Calculate height based on duration
        let durationHours = endHour - startHour
        let durationMinutes = endMinute - startMinute

        if (durationHours < 0) durationHours += 24
        if (durationMinutes < 0) {
            durationMinutes += 60
            durationHours -= 1
        }

        const totalDurationInHours = durationHours + (durationMinutes / 60)
        const height = Math.max(totalDurationInHours * hourHeight, 24) // Minimum height

        // Calculate left position - ensure proper column alignment
        const left = 70 + (dayIndex * columnWidth) // 70px for time column

        // Use a slightly smaller width to prevent overlap
        const width = columnWidth - 4

        return { top, height, left, width }
    }, [columnWidth])

    // Pre-calculate events for each day with memoization
    const dayEvents = useMemo(() => {
        return weekDays.map((day, dayIndex) => {
            const events = getEventsForDate(day.year, day.month, day.date)
            const positionedEvents = events.map(event => {
                const position = calculateEventPosition(event, dayIndex)
                return { event, position }
            }).filter(item => item.position !== null) as { event: Event, position: { top: number; height: number; left: number; width: number } }[]

            return positionedEvents
        })
    }, [weekDays, getEventsForDate, calculateEventPosition])

    // Memoize the day headers
    const dayHeaders = useMemo(() => {
        return weekDays.map((day, index) => {
            const isPast = isPastDate(day.fullDate)
            const isToday = isSameDay(day.fullDate, today)

            return (
                <DayHeader
                    key={index}
                    day={day}
                    columnWidth={columnWidth}
                    isPast={isPast}
                    isToday={isToday}
                />
            )
        })
    }, [weekDays, columnWidth, today])

    // Memoize the time grid
    const timeGrid = useMemo(() => {
        return hours.map((hour, hourIndex) => {
            const [hourStr, period] = hour.split(' ')
            const hourVal = parseInt(hourStr.split(':')[0])
            const hourNum =
                period === 'PM' && hourVal !== 12
                    ? hourVal + 12
                    : period === 'AM' && hourVal === 12
                        ? 0
                        : hourVal

            return (
                <div key={hourIndex} className="flex">
                    <div className="w-[70px] h-14 border-b border-r text-xs text-right pr-2 pt-1 text-gray-500 flex-shrink-0">
                        {hour}
                    </div>
                    <div className="flex flex-1">
                        {weekDays.map((day, dayIndex) => {
                            const cellDate = new Date(day.fullDate)
                            cellDate.setHours(hourNum, 0, 0, 0)

                            const isPast = isPastDate(cellDate)
                            const isNow =
                                isSameDay(cellDate, today) && today.getHours() === hourNum

                            return (
                                <TimeCell
                                    key={`day-${dayIndex}`}
                                    columnWidth={columnWidth}
                                    isPast={isPast}
                                    isNow={isNow}
                                />
                            )
                        })}
                    </div>
                </div>
            )
        })
    }, [hours, weekDays, columnWidth, today])

    // Memoize the flattened events array
    const flattenedEvents = useMemo(() => {
        return dayEvents.flatMap((events, dayIndex) =>
            events.map((item, eventIndex) => (
                <EventItem
                    key={`event-${dayIndex}-${eventIndex}-${item.event.eventId || item.event._id}`}
                    event={item.event}
                    position={item.position}
                    handleEventClick={handleEventClick}
                />
            ))
        )
    }, [dayEvents, handleEventClick])

    return (
        <div
            className="bg-white-100 rounded-lg border border-gray-200 overflow-auto shadow-sm"
            ref={weekContainerRef}
            style={{ height: '700px' }} // Fixed height for better scrolling experience
        >
            {/* Header row with days - Make this sticky */}
            <div className="flex border-b sticky top-0 bg-white-100 z-20">
                {/* Empty top-left corner cell */}
                <div className="w-[70px] border-r py-3 flex-shrink-0"></div>

                {/* Day headers */}
                <div className="flex flex-1">
                    {dayHeaders}
                </div>
            </div>

            <div className="relative">
                {/* Time grid */}
                {timeGrid}

                {/* Current time indicator - red line */}
                {weekDays.some(day => isSameDay(day.fullDate, today)) && (
                    <div
                        className="absolute left-0 right-0 z-20 pointer-events-none"
                        style={{ top: `${currentTime.top}px` }}
                    >
                        <div className="flex items-center">
                            <div className="w-[70px] flex justify-end pr-2 border-b border-r">
                                <div className="h-3 w-3 rounded-full bg-red-500 -mr-1.5"></div>
                            </div>
                            <div className="h-0.5 bg-red-500 flex-grow"></div>
                        </div>
                    </div>
                )}

                {/* Events overlay */}
                {flattenedEvents}
            </div>
        </div>
    )
})

WeekView.displayName = 'WeekView'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDaysInMonth = (year: number, month: number): number[] => {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => i + 1)
}

// Helper function to get previous month days that appear in current view
export const getPrevMonthDays = (year: number, month: number): number[] => {
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  return Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthLastDay - firstDayOfMonth + i + 1,
  )
}

// Helper function to get next month days that appear in current view
export const getNextMonthDays = (year: number, month: number): number[] => {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysFromNextMonth = 6 - lastDayOfMonth.getDay()

  return Array.from({ length: daysFromNextMonth }, (_, i) => i + 1)
}

// Helper function to get hours for the day
export const getHoursOfDay = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const period = i < 12 ? 'AM' : 'PM'
    return `${hour}:00 ${period}`
  })
}

// Helper function to check if a date is in the past
export const isPastDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Helper function to check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Get color based on event status
export const getEventColor = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'on sale':
      return 'bg-green-500'
    case 'cancelled':
      return 'bg-red-500'
    case 'draft':
      return 'bg-gray-500'
    default:
      return 'bg-blue-500'
  }
}

// Format time string for display
export function formatTime(timeString: string) {
  if (!timeString) return ''

  // Handle if timeString is already in the correct format
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString
  }

  // Parse time from 24-hour format (HH:MM)
  const [hours, minutes] = timeString
    .split(':')
    .map((num: string) => parseInt(num, 10))
  if (isNaN(hours) || isNaN(minutes)) return timeString

  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHour = hours % 12 || 12 // Convert 0 to 12 for 12 AM

  return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Calculate position of event in calendar for week view
export const calculateEventPosition = (
  event: Event,
  columnWidth: number,
): EventPosition | null => {
  if (!event.startTime || !event.endTime) return null

  // Parse start and end times
  let startHour = 0
  let startMinute = 0
  let endHour = 0
  let endMinute = 0

  // Handle different time formats
  if (event.startTime.includes('AM') || event.startTime.includes('PM')) {
    // Parse 12-hour format (e.g., "8:00 PM")
    const startMatch = event.startTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
    const endMatch = event.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i)

    if (startMatch && endMatch) {
      startHour = parseInt(startMatch[1])
      startMinute = parseInt(startMatch[2])
      const startPeriod = startMatch[3].toUpperCase()

      // Convert to 24-hour format
      if (startPeriod === 'PM' && startHour < 12) startHour += 12
      if (startPeriod === 'AM' && startHour === 12) startHour = 0

      endHour = parseInt(endMatch[1])
      endMinute = parseInt(endMatch[2])
      const endPeriod = endMatch[3].toUpperCase()

      // Convert to 24-hour format
      if (endPeriod === 'PM' && endHour < 12) endHour += 12
      if (endPeriod === 'AM' && endHour === 12) endHour = 0
    }
  } else {
    // Parse 24-hour format (e.g., "20:00")
    const startParts = event.startTime.split(':')
    const endParts = event.endTime.split(':')

    if (startParts.length >= 2 && endParts.length >= 2) {
      startHour = parseInt(startParts[0])
      startMinute = parseInt(startParts[1])
      endHour = parseInt(endParts[0])
      endMinute = parseInt(endParts[1])
    }
  }

  // Calculate position based on time
  const hourHeight = 56 // Each hour is 56px tall (matches Google Calendar)

  // Calculate top position based on start time
  const top = startHour * hourHeight + (startMinute / 60) * hourHeight

  // Calculate height based on duration
  let durationHours = endHour - startHour
  let durationMinutes = endMinute - startMinute

  // Handle cases where end time is earlier (next day)
  if (durationHours < 0) durationHours += 24
  if (durationMinutes < 0) {
    durationMinutes += 60
    durationHours -= 1
  }

  const totalDurationInHours = durationHours + durationMinutes / 60
  const height = Math.max(totalDurationInHours * hourHeight, 24) // Minimum height of 24px

  // Set width slightly less than column width to avoid overflow
  const width = columnWidth - 4 // 2px margin on each side

  return { top, height, width }
}

// Get month names
export const getMonthNames = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const fullMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return { months, fullMonths }
}

// Get weekday names
export const getWeekDayNames = () => {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
}

export const getWeekDaysForDate = (
  year: number,
  month: number,
  day: number,
): WeekDay[] => {
  const weekDays: WeekDay[] = []
  const weekDayNames = getWeekDayNames()

  // Calculate the date for the current day
  const currentDate = new Date(year, month, day)

  // Find the start of the week (Sunday)
  const firstDayOfWeek = new Date(currentDate)
  const dayOfWeek = currentDate.getDay()
  firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek)

  // Generate all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek)
    date.setDate(firstDayOfWeek.getDate() + i)

    weekDays.push({
      day: weekDayNames[date.getDay()],
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      fullDate: new Date(date),
    })
  }

  return weekDays
}

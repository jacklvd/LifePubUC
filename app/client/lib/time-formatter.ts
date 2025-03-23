/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatTime(timeString: any) {
  if (!timeString) return ''

  // Handle if timeString is already in the correct format
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString
  }

  // Parse time from 24-hour format (HH:MM)
  const [hours, minutes] = timeString
    .split(':')
    .map((num: any) => parseInt(num, 10))
  if (isNaN(hours) || isNaN(minutes)) return timeString

  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHour = hours % 12 || 12 // Convert 0 to 12 for 12 AM

  return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Group events by date for calendar view
export function groupEventsByDate(events: any) {
  if (!events || !Array.isArray(events)) return {}

  const eventsByDate: any = {}

  events.forEach((event) => {
    if (!event.date) return

    const date = new Date(event.date)
    if (isNaN(date.getTime())) return

    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format

    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = []
    }

    eventsByDate[dateKey].push(event)
  })

  return eventsByDate
}

// Calculate position of event in calendar for week view
export const calculateEventPosition = (event: Event, columnWidth: number) => {
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
  const hourHeight = 48 // Each hour is 48px tall

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

// Get day of the month from a date
export function getDayOfMonth(dateString: any) {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return date.getDate()
}

// Get event status label
export function getEventStatus(status: any) {
  switch (status?.toLowerCase()) {
    case 'on sale':
      return 'On Sale'
    case 'draft':
      return 'Draft'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status || 'Unknown'
  }
}

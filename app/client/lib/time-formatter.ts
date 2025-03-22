/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatTime(timeString: any) {
    if (!timeString) return ''
    
    // Handle if timeString is already in the correct format
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }
    
    // Parse time from 24-hour format (HH:MM)
    const [hours, minutes] = timeString.split(':').map((num: any) => parseInt(num, 10))
    if (isNaN(hours) || isNaN(minutes)) return timeString
    
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHour = hours % 12 || 12 // Convert 0 to 12 for 12 AM
    
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  // Group events by date for calendar view
  export function groupEventsByDate(events: any) {
    if (!events || !Array.isArray(events)) return {}
    
    const eventsByDate: any = {}
    
    events.forEach(event => {
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
  export function calculateEventPosition(event: any, columnWidth: any, dayStartHour = 0) {
    if (!event?.startTime || !event?.endTime) return null
    
    // Parse event times
    const [startHour, startMinute] = event.startTime.split(':').map((num: any) => parseInt(num, 10))
    const [endHour, endMinute] = event.endTime.split(':').map((num: any) => parseInt(num, 10))
    
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
      return null
    }
    
    // Calculate position based on times
    const hourHeight = 56 // Height of one hour in the calendar (matches the 'h-14' class)
    const minuteHeight = hourHeight / 60
    
    const startTimeOffset = (startHour - dayStartHour) * hourHeight + startMinute * minuteHeight
    const endTimeOffset = (endHour - dayStartHour) * hourHeight + endMinute * minuteHeight
    const eventHeight = endTimeOffset - startTimeOffset
    
    return {
      top: `${startTimeOffset}px`,
      height: `${eventHeight}px`,
      width: `${columnWidth}px`
    }
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
/**
 * Safely formats a date string to a consistent format for both server and client rendering
 *
 * @param dateString - The date string to format (expects ISO or YYYY-MM-DD format)
 * @param format - The format to use (simple, display, or iso)
 * @returns Formatted date string or fallback text if invalid
 */
export const formatDate = (
  dateString?: string | null,
  format: 'simple' | 'display' | 'iso' = 'simple',
): string => {
  if (!dateString) return 'Date TBD'

  try {
    let date: Date

    // Handle ISO string format (like "2025-03-29T00:00:00.000Z")
    if (dateString.includes('T')) {
      date = new Date(dateString)
    }
    // Handle YYYY-MM-DD format
    else if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(Number)
      // Use noon to avoid timezone issues
      date = new Date(year, month - 1, day, 12, 0, 0)
    }
    // Fallback for unexpected formats
    else {
      return dateString || 'Date TBD'
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Date TBD'
    }

    switch (format) {
      // Simple format for server-side rendering (avoids hydration errors)
      case 'simple':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      // Display format for UI (should only be used client-side)
      case 'display':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`

      // ISO format without time
      case 'iso':
        return date.toISOString().split('T')[0]

      default:
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date TBD'
  }
}

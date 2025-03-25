import React, { memo, useCallback } from 'react'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { Icon } from '../../../../../components/icons'

interface Props {
  title: string
  summary: string
  error?: string
  onTitleChange: (title: string) => void
  onSummaryChange: (summary: string) => void
}

const EventTitleInput = memo(
  ({ title, summary, error, onTitleChange, onSummaryChange }: Props) => {
    // Create memoized callbacks to avoid unnecessary rerenders
    const handleTitleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onTitleChange(e.target.value)
      },
      [onTitleChange],
    )

    const handleSummaryChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSummaryChange(e.target.value)
      },
      [onSummaryChange],
    )

    return (
      <div className="mb-4 sm:mb-6">
        <div className="relative rounded-md border bg-white-100 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
            Event Overview
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
            Give your event a title that stands out.
          </p>
          <Input
            placeholder="A wonderful title for your event."
            value={title}
            onChange={handleTitleChange}
            className="w-full"
            aria-label="Event title"
            aria-invalid={!!error}
            aria-describedby={error ? 'title-error' : undefined}
          />
          {error && (
            <p
              className="text-red-500 text-xs sm:text-sm mt-1"
              id="title-error"
            >
              {error}
            </p>
          )}
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 pt-2 sm:pt-3">
            A brief description of your event.
          </p>

          <Input
            placeholder="A short and sweet sentence about your event."
            value={summary}
            onChange={handleSummaryChange}
            className="w-full"
            aria-label="Event summary"
          />
          <Button
            variant="ghost"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full border"
            aria-label="Add more details"
          >
            <Icon name="Plus" className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    )
  },
)

EventTitleInput.displayName = 'EventTitleInput'

export default EventTitleInput

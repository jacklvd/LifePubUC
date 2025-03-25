import React, { memo, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'

interface Props {
  description: string
  handleChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
  ) => void
  error?: string
}

const EventInsight = memo(({ description, handleChange, error }: Props) => {
  // Create memoized callback
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleChange(e, 'description')
    },
    [handleChange],
  )

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative rounded-md overflow-hidden border bg-white-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-4">Insight</h3>
        <Textarea
          placeholder="Use this section to provide more details about your event. You can include things to know, venue information, accessibility options—anything that will help people know what to expect."
          className="resize-none w-full min-h-[80px] sm:min-h-[120px]"
          rows={3}
          value={description}
          onChange={onChangeHandler}
          aria-label="Event description"
          aria-invalid={!!error}
          aria-describedby={error ? 'description-error' : undefined}
        />
        {error && (
          <p
            className="text-red-500 text-xs sm:text-sm mt-1"
            id="description-error"
            role="alert"
          >
            {error}
          </p>
        )}
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
})

EventInsight.displayName = 'EventInsight'

export default EventInsight

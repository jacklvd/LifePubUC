/* eslint-disable @typescript-eslint/no-explicit-any */
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'

interface Props {
  description: string
  handleChange: (e: any, description: any) => void
  error?: string
}

const EventInsight = ({ description, handleChange, error }: Props) => {
  return (
    <div className="relative rounded-md overflow-hidden border bg-white-100 p-6">
      <h3 className="text-lg font-bold mb-4">Insight</h3>
      <Textarea
        placeholder="Use this section to provide more details about your event. You can include things to know, venue information, accessibility options—anything that will help people know what to expect."
        className="resize-none"
        rows={3}
        value={description}
        onChange={(e) => handleChange(e, 'description')}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <Button
        variant="ghost"
        className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
      >
        <Icon name="Plus" className="h-4 w-4" />
      </Button>
    </div>
  )
}
export default EventInsight

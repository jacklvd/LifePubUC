// components/ticket-ui.tsx
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTicketManagement } from '@/hooks/use-ticket'
import { useEventProgress } from '@/context/event-context'
import TicketCard from '@/components/ticket-ui/ticket-card'
import CapacityCard from '@/components/ticket-ui/capactity-card'
import TicketDialogs from '@/components/ticket-ui/ticket-dialogs'
import SidebarContent from '@/components/ticket-ui/sidebar-content'
import EmptyTicketState from '@/components/ticket-ui/empty-ticket-state'
import { toast } from 'sonner'

interface TicketUIProps {
  eventId: string
}

const TicketUI: React.FC<TicketUIProps> = ({ eventId }) => {
  const router = useRouter()

  // Use the event progress context
  const {
    setEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
  } = useEventProgress()

  // Use our custom ticket hook
  const ticketHook = useTicketManagement(eventId, markStepCompleted)


  // Effect to update event context after fetching
  useEffect(() => {
    try {
      if (ticketHook.event) {
        setEventId(eventId)
        setEventTitle(ticketHook.event?.title || '')
        // Always provide a string, use empty string instead of null
        setEventDate(
          ticketHook.event?.date
            ? new Date(ticketHook.event.date).toLocaleDateString()
            : '',
        )
        setActiveStep('tickets')

        // If we're on the tickets page, mark build as completed
        if (!completedSteps.includes('build')) {
          markStepCompleted('build')
        }
      } else {
        toast.error('Event data is not available yet.')
        console.warn('Event data is not available yet.')
        return
      }
    } catch (error) {
      console.error('Error updating event context:', error)
      setEventId('') // Reset eventId in case of error
    }
  }, [
    ticketHook.event,
    eventId,
    setEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
  ])

  // Effect to check if build step is completed before allowing access
  useEffect(() => {
    if (!completedSteps.includes('build') && !ticketHook.error) {
      console.warn('You need to complete the build step first')

      const redirectPath = eventId
        ? `/organization/events/${eventId}/edit`
        : '/organization/events/create'

      router.push(redirectPath)
    }
  }, [completedSteps, eventId, router, ticketHook.error])

  const handleContinueToPublish = () => {
    // Mark tickets step as completed if not already
    markStepCompleted('tickets')

    // Navigate to publish page
    router.push(`/organization/events/${eventId}/publish`)
  }

  if (ticketHook.loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <p>Loading ticket information...</p>
        </div>
      </div>
    )
  }

  // Get the time options array directly from the hook
  const timeOptions = ticketHook.generateTimeOptions || []

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Tickets</h1>
            <div className="flex gap-2">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={ticketHook.openAddDialog} // Use openAddDialog directly
              >
                Add more tickets
              </Button>

              {ticketHook.tickets.length > 0 && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleContinueToPublish}
                >
                  Continue to Publish
                </Button>
              )}
            </div>
          </div>

          <Tabs
            defaultValue="admission"
            value={ticketHook.activeTab}
            onValueChange={ticketHook.setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="addons">Add-ons</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="holds">Holds</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="admission" className="space-y-4">
              {ticketHook.tickets.length === 0 ? (
                <EmptyTicketState
                  onAddClick={ticketHook.openAddDialog} // Use openAddDialog directly
                />
              ) : (
                <>
                  {ticketHook.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      formatTicketDate={ticketHook.formatTicketDate}
                      onEdit={ticketHook.openEditDialog} // Use openEditDialog directly
                      onDelete={ticketHook.openDeleteDialog} // Use openDeleteDialog directly
                    />
                  ))}

                  <CapacityCard
                    tickets={ticketHook.tickets}
                    totalCapacity={ticketHook.totalCapacity}
                    onEditCapacity={() =>
                      ticketHook.setIsCapacityDialogOpen(true)
                    }
                  />
                </>
              )}
            </TabsContent>

            {/* Other tab contents */}
            <TabsContent value="addons">
              Add-ons content would go here
            </TabsContent>
            <TabsContent value="promotions">
              Promotions content would go here
            </TabsContent>
            <TabsContent value="holds">Holds content would go here</TabsContent>
            <TabsContent value="settings">
              Settings content would go here
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-1/4">
          <SidebarContent />
        </div>
      </div>

      {/* Dialogs */}
      <TicketDialogs
        isAddDialogOpen={ticketHook.isAddDialogOpen}
        setIsAddDialogOpen={ticketHook.setIsAddDialogOpen}
        isEditDialogOpen={ticketHook.isEditDialogOpen}
        setIsEditDialogOpen={ticketHook.setIsEditDialogOpen}
        isCapacityDialogOpen={ticketHook.isCapacityDialogOpen}
        setIsCapacityDialogOpen={ticketHook.setIsCapacityDialogOpen}
        isDeleteDialogOpen={ticketHook.isDeleteDialogOpen}
        setIsDeleteDialogOpen={ticketHook.setIsDeleteDialogOpen}
        totalCapacity={ticketHook.totalCapacity}
        setTotalCapacity={ticketHook.setTotalCapacity}
        currentTicket={ticketHook.currentTicket}
        ticketType={ticketHook.ticketType}
        ticketName={ticketHook.ticketName}
        ticketCapacity={ticketHook.ticketCapacity}
        ticketPrice={ticketHook.ticketPrice}
        saleStartDate={ticketHook.saleStartDate}
        saleEndDate={ticketHook.saleEndDate}
        startTime={ticketHook.startTime}
        endTime={ticketHook.endTime}
        minPerOrder={ticketHook.minPerOrder}
        maxPerOrder={ticketHook.maxPerOrder}
        eventDate={
          ticketHook.event?.date ? new Date(ticketHook.event.date) : undefined
        }
        eventEndTime={ticketHook.eventEndTime}
        maxSaleEndDate={ticketHook.maxSaleEndDate}
        setTicketType={ticketHook.setTicketType}
        setTicketName={ticketHook.setTicketName}
        setTicketCapacity={ticketHook.setTicketCapacity}
        setTicketPrice={ticketHook.setTicketPrice}
        setSaleStartDate={ticketHook.setSaleStartDate}
        setSaleEndDate={ticketHook.setSaleEndDate}
        setStartTime={ticketHook.setStartTime}
        setEndTime={ticketHook.setEndTime}
        setMinPerOrder={ticketHook.setMinPerOrder}
        setMaxPerOrder={ticketHook.setMaxPerOrder}
        handleAddTicket={ticketHook.handleAddTicket}
        handleUpdateTicket={ticketHook.handleUpdateTicket}
        handleDeleteTicket={ticketHook.handleDeleteTicket}
        handleUpdateCapacity={ticketHook.handleUpdateCapacity}
        generateTimeOptions={timeOptions}
        startDateCalendarOpen={ticketHook.startDateCalendarOpen}
        setStartDateCalendarOpen={ticketHook.setStartDateCalendarOpen}
        endDateCalendarOpen={ticketHook.endDateCalendarOpen}
        setEndDateCalendarOpen={ticketHook.setEndDateCalendarOpen}
        isEndDateDisabled={ticketHook.isEndDateDisabled}
      />
    </div>
  )
}

export default TicketUI
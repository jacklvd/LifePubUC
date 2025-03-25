// components/ticket-ui.tsx
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEventProgress } from '@/context/event-context'
import TicketCard from '@/app/organization/events/[eventId]/ticket/components/ticket-card'
import CapacityCard from '@/app/organization/events/[eventId]/ticket/components/capactity-card'
import TicketDialogs from '@/app/organization/events/[eventId]/ticket/components/ticket-dialogs'
import SidebarContent from '@/app/organization/events/[eventId]/ticket/components/sidebar-content'
import EmptyTicketState from '@/app/organization/events/[eventId]/ticket/components/empty-ticket-state'
import { useTicketStore } from '@/store/ticketStore'
import { CalendarType } from '@/constants'

interface TicketUIProps {
  eventId: string
  userEmail?: string
}

const TicketUI: React.FC<TicketUIProps> = ({ eventId, userEmail }) => {
  const router = useRouter()

  // Use the event progress context
  const {
    setEventId: setProgressEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
  } = useEventProgress()

  // Use individual selectors for better performance
  // This avoids the "getSnapshot should be cached" error
  const initialize = useTicketStore((state) => state.initialize)
  // const activeTab = useTicketStore((state) => state.activeTab)
  // const setActiveTab = useTicketStore((state) => state.setActiveTab)
  const tickets = useTicketStore((state) => state.tickets)
  const totalCapacity = useTicketStore((state) => state.totalCapacity)
  const event = useTicketStore((state) => state.event)
  const loading = useTicketStore((state) => state.loading)
  const error = useTicketStore((state) => state.error)
  const timeOptions = useTicketStore((state) => state.timeOptions)

  // Dialog states
  const activeDialog = useTicketStore((state) => state.activeDialog)
  const activeCalendar = useTicketStore((state) => state.activeCalendar)
  const currentTicket = useTicketStore((state) => state.currentTicket)

  // Dialog actions
  const openAddDialog = useTicketStore((state) => state.openAddDialog)
  const openEditDialog = useTicketStore((state) => state.openEditDialog)
  const openDeleteDialog = useTicketStore((state) => state.openDeleteDialog)
  const closeAllDialogs = useTicketStore((state) => state.closeAllDialogs)
  const setCalendar = useTicketStore((state) => state.setCalendar)

  // Form state - using stable selectors
  const form = useTicketStore((state) => state.form)
  const {
    ticketType,
    ticketName,
    ticketCapacity,
    ticketPrice,
    saleStartDate,
    saleEndDate,
    startTime,
    endTime,
    minPerOrder,
    maxPerOrder,
  } = form

  // Form actions
  const updateFormField = useTicketStore((state) => state.updateFormField)

  // CRUD operations
  const addTicket = useTicketStore((state) => state.addTicket)
  const updateTicketAction = useTicketStore((state) => state.updateTicket)
  const deleteTicketAction = useTicketStore((state) => state.deleteTicket)
  const updateCapacity = useTicketStore((state) => state.updateCapacity)

  // Utils
  const formatTicketDate = useTicketStore((state) => state.formatTicketDate)
  const isEndDateDisabled = useTicketStore((state) => state.isEndDateDisabled)

  // Initialize the store when component mounts
  useEffect(() => {
    initialize(eventId, userEmail, markStepCompleted)
  }, [eventId, initialize, markStepCompleted, userEmail])

  // Effect to update event context after fetching
  useEffect(() => {
    try {
      if (event) {
        setProgressEventId(eventId)
        setEventTitle(event?.title || '')
        // Always provide a string, use empty string instead of null
        setEventDate(
          event?.date ? new Date(event.date).toLocaleDateString() : '',
        )
        setActiveStep('tickets')

        // If we're on the tickets page, mark build as completed
        if (!completedSteps.includes('build')) {
          markStepCompleted('build')
        }
      } else {
        // Do nothing if event is not loaded yet
        return
      }
    } catch (error) {
      console.error('Error updating event context:', error)
      setProgressEventId('') // Reset eventId in case of error
    }
  }, [
    event,
    eventId,
    setProgressEventId,
    setEventTitle,
    setEventDate,
    setActiveStep,
    markStepCompleted,
    completedSteps,
  ])

  // Effect to check if build step is completed before allowing access
  useEffect(() => {
    if (!completedSteps.includes('build') && !error) {
      console.warn('You need to complete the build step first')

      const redirectPath = eventId
        ? `/organization/events/${eventId}/edit`
        : '/organization/events/create'

      router.push(redirectPath)
    }
  }, [completedSteps, eventId, router, error])

  const handleContinueToPublish = () => {
    // Mark tickets step as completed if not already
    markStepCompleted('tickets')

    // Navigate to publish page
    router.push(`/organization/events/${eventId}/publish`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <p>Loading ticket information...</p>
        </div>
      </div>
    )
  }

  // Map state to props for form field setters with proper TypeScript types
  const setTicketType = (value: 'Free' | 'Paid' | 'Donation') =>
    updateFormField('ticketType', value)
  const setTicketName = (value: string) => updateFormField('ticketName', value)
  const setTicketCapacity = (value: number) =>
    updateFormField('ticketCapacity', value)
  const setTicketPrice = (value: number | undefined) =>
    updateFormField('ticketPrice', value)
  const setSaleStartDate = (value: Date | undefined) =>
    updateFormField('saleStartDate', value)
  const setSaleEndDate = (value: Date | undefined) =>
    updateFormField('saleEndDate', value)
  const setStartTime = (value: string) => updateFormField('startTime', value)
  const setEndTime = (value: string) => updateFormField('endTime', value)
  const setMinPerOrder = (value: number) =>
    updateFormField('minPerOrder', value)
  const setMaxPerOrder = (value: number) =>
    updateFormField('maxPerOrder', value)

  // Calendar open states mapped to activeCalendar
  const startDateCalendarOpen = activeCalendar === 'start'
  const endDateCalendarOpen = activeCalendar === 'end'
  const setStartDateCalendarOpen = (open: boolean) =>
    setCalendar(open ? 'start' : null)
  const setEndDateCalendarOpen = (open: boolean) =>
    setCalendar(open ? 'end' : null)

  // Dialog open states mapped to activeDialog
  const isAddDialogOpen = activeDialog === 'add'
  const isEditDialogOpen = activeDialog === 'edit'
  const isDeleteDialogOpen = activeDialog === 'delete'
  const isCapacityDialogOpen = activeDialog === 'capacity'

  // Dialog setters mapped to store methods
  const setIsAddDialogOpen = (open: boolean) =>
    open ? openAddDialog() : closeAllDialogs()
  const setIsEditDialogOpen = (open: boolean) =>
    open ? currentTicket && openEditDialog(currentTicket) : closeAllDialogs()
  const setIsDeleteDialogOpen = (open: boolean) =>
    open ? currentTicket && openDeleteDialog(currentTicket) : closeAllDialogs()
  const setIsCapacityDialogOpen = (open: boolean) =>
    open ? setCalendar('capacity' as CalendarType) : closeAllDialogs()

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Tickets</h1>
            <div className="flex gap-2">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={openAddDialog}
              >
                Add more tickets
              </Button>

              {tickets.length > 0 && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleContinueToPublish}
                >
                  Continue to Publish
                </Button>
              )}
            </div>
          </div>

          {/* <Tabs
            defaultValue="admission"
            value={activeTab}
            onValueChange={setActiveTab}
          > */}
          {/* <TabsList className="mb-4">
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
            </TabsList>

            <TabsContent value="admission" className="space-y-4"> */}
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <EmptyTicketState onAddClick={openAddDialog} />
            ) : (
              <>
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    formatTicketDate={formatTicketDate}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}

                <CapacityCard
                  tickets={tickets}
                  totalCapacity={totalCapacity}
                  onEditCapacity={() => setIsCapacityDialogOpen(true)}
                />
              </>
            )}
          </div>

          {/* </TabsContent>

            <TabsContent value="promotions">
              Promotions content would go here
            </TabsContent>
          </Tabs> */}
        </div>

        <div className="w-full lg:w-1/4">
          <SidebarContent />
        </div>
      </div>

      {/* Dialogs */}
      <TicketDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isCapacityDialogOpen={isCapacityDialogOpen}
        setIsCapacityDialogOpen={setIsCapacityDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        totalCapacity={totalCapacity}
        setTotalCapacity={setTicketCapacity}
        currentTicket={currentTicket}
        ticketType={ticketType}
        ticketName={ticketName}
        ticketCapacity={ticketCapacity}
        ticketPrice={ticketPrice}
        saleStartDate={saleStartDate}
        saleEndDate={saleEndDate}
        startTime={startTime}
        endTime={endTime}
        minPerOrder={minPerOrder}
        maxPerOrder={maxPerOrder}
        eventDate={event?.date ? new Date(event.date) : undefined}
        eventEndTime={event?.endTime || '11:59 PM'}
        maxSaleEndDate={event?.date ? new Date(event.date) : undefined}
        setTicketType={setTicketType}
        setTicketName={setTicketName}
        setTicketCapacity={setTicketCapacity}
        setTicketPrice={setTicketPrice}
        setSaleStartDate={setSaleStartDate}
        setSaleEndDate={setSaleEndDate}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        setMinPerOrder={setMinPerOrder}
        setMaxPerOrder={setMaxPerOrder}
        handleAddTicket={addTicket}
        handleUpdateTicket={updateTicketAction}
        handleDeleteTicket={deleteTicketAction}
        handleUpdateCapacity={updateCapacity}
        generateTimeOptions={timeOptions}
        startDateCalendarOpen={startDateCalendarOpen}
        setStartDateCalendarOpen={setStartDateCalendarOpen}
        endDateCalendarOpen={endDateCalendarOpen}
        setEndDateCalendarOpen={setEndDateCalendarOpen}
        isEndDateDisabled={isEndDateDisabled}
      />
    </div>
  )
}

export default TicketUI

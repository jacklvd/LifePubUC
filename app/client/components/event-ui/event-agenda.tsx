import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/icons'

interface EventAgendaProps {
  agendas: Agenda[]
  setAgendas: React.Dispatch<React.SetStateAction<Agenda[]>>
  eventStartTime: string
  eventEndTime: string
  errors?: any
}

const EventAgenda = ({
  agendas,
  setAgendas,
  eventStartTime,
  eventEndTime,
  errors,
}: EventAgendaProps) => {
  const [activeAgenda, setActiveAgenda] = useState('welcome')
  const [showAgendaForm, setShowAgendaForm] = useState(false)
  const [newAgendaTitle, setNewAgendaTitle] = useState('')
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [selectedTimeField, setSelectedTimeField] = useState<{
    field: 'startTime' | 'endTime'
    itemId: string
  } | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [menuOpenForAgenda, setMenuOpenForAgenda] = useState<string | null>(
    null,
  )
  const [renamingAgendaId, setRenamingAgendaId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const editingRef = useRef<HTMLDivElement>(null)

  const generateTimeSlots = (startTime?: string, endTime?: string) => {
    // Ensure both startTime and endTime are selected before processing
    if (
      !startTime ||
      !endTime ||
      startTime.trim() === 'H' ||
      endTime.trim() === 'H'
    ) {
      console.warn(
        '🚨 Incomplete start or end time. Skipping time slot generation.',
      )
      return []
    }

    const parseTime = (time: string) => {
      const parts = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/)
      if (!parts) {
        console.error('🚨 Invalid time format detected:', time)
        return null
      }
      return {
        hour: parseInt(parts[1], 10),
        minute: parseInt(parts[2], 10),
        period: parts[3] as 'AM' | 'PM',
      }
    }

    const start = parseTime(startTime)
    const end = parseTime(endTime)
    if (!start || !end) return []

    let {
      hour: currentHour,
      minute: currentMinute,
      period: currentPeriod,
    } = start
    const { hour: endHour, minute: endMinute, period: endPeriod } = end
    const timeSlots = []

    while (
      (currentPeriod === endPeriod &&
        (currentHour < endHour ||
          (currentHour === endHour && currentMinute <= endMinute))) ||
      (currentPeriod === 'AM' && endPeriod === 'PM')
    ) {
      timeSlots.push(
        `${currentHour}:${currentMinute.toString().padStart(2, '0')} ${currentPeriod}`,
      )

      // Increment time by 30 minutes
      currentMinute += 30
      if (currentMinute === 60) {
        currentMinute = 0
        currentHour++
      }

      if (currentHour === 12 && currentMinute === 0) {
        currentPeriod = currentPeriod === 'AM' ? 'PM' : 'AM'
      }
    }

    return timeSlots
  }

  const timeSlots = generateTimeSlots(eventStartTime, eventEndTime)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingRef.current &&
        !editingRef.current.contains(e.target as Node)
      ) {
        const currentAgenda = agendas.find(
          (agenda) => agenda.id === activeAgenda,
        )
        const currentItem = currentAgenda?.items.find(
          (item) => item.id === editingItem,
        )

        if (currentItem) {
          if (!currentItem.title.trim()) {
            setFormErrors({ title: "Event Title can't be left blank" })
            return // Prevent exiting edit mode
          }
        }

        if (Object.keys(errors).length > 0) {
          setFormErrors(errors)
          return // Prevent exiting edit mode
        }

        setEditingItem(null)
        setSelectedTimeField(null)
        setOpenDropdownId(null)
        setFormErrors({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingRef, agendas, activeAgenda, editingItem])

  const handleDeleteAgenda = (agendaId: string) => {
    setAgendas(agendas.filter((agenda) => agenda.id !== agendaId))

    // Set a new active agenda if the deleted one was active
    if (activeAgenda === agendaId) {
      const remainingAgendas = agendas.filter(
        (agenda) => agenda.id !== agendaId,
      )
      if (remainingAgendas.length > 0) {
        setActiveAgenda(remainingAgendas[0].id)
      }
    }
  }

  const handleRenameAgenda = (agendaId: string) => {
    setRenamingAgendaId(agendaId)
    setRenameTitle(agendas.find((a) => a.id === agendaId)?.title || '')
    setMenuOpenForAgenda(null)
  }

  const handleRenameSubmit = () => {
    setAgendas(
      agendas.map((agenda) => {
        if (agenda.id === renamingAgendaId) {
          return { ...agenda, title: renameTitle }
        }
        return agenda
      }),
    )
    setRenamingAgendaId(null)
    setRenameTitle('')
  }

  const handleAgendaTabClick = (agendaId: any) => {
    setActiveAgenda(agendaId)
    setAgendas(
      agendas.map((agenda) => ({
        ...agenda,
        active: agenda.id === agendaId,
      })),
    )
  }

  const handleAddNewAgenda = () => {
    setShowAgendaForm(true)
  }

  const handleCreateNewAgenda = () => {
    const agendaId = `event-${Date.now()}`
    const newAgenda: Agenda = {
      id: agendaId,
      title: 'Unified Agenda',
      active: true,
      items: [
        {
          id: Date.now().toString(),
          title: '',
          startTime: '',
          endTime: '',
          description: '',
          host: '',
          isNew: true,
        },
      ],
    }

    setAgendas(
      agendas.map((agenda) => ({ ...agenda, active: false })).concat(newAgenda),
    )
    setActiveAgenda(agendaId)
    setNewAgendaTitle('')
    setEditingItem(newAgenda.items[0].id)
  }

  const handleAddSlot = () => {
    const activeAgendaObj = agendas.find((agenda) => agenda.id === activeAgenda)
    if (!activeAgendaObj) return

    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      host: '',
      isNew: true,
    }

    const updatedAgendas = agendas?.map((agenda) => {
      if (agenda.id === activeAgenda) {
        return {
          ...agenda,
          items: [...agenda.items, newItem],
        }
      }
      return agenda
    })

    setAgendas(updatedAgendas)
    setEditingItem(newItem.id)
  }

  const handleTimeClick = (
    fieldId: 'startTime' | 'endTime',
    itemId: string,
  ) => {
    if (openDropdownId === itemId) {
      setOpenDropdownId(null)
    } else {
      setSelectedTimeField({ field: fieldId, itemId })
      setOpenDropdownId(itemId)
    }
  }

  const handleSelectTime = (time: string) => {
    if (!selectedTimeField) return

    // Ensure time format matches "HH:mm AM/PM"
    // time should already be in this format based on your timeSlots array

    const updatedAgendas = agendas.map((agenda) => {
      if (agenda.id === activeAgenda) {
        return {
          ...agenda,
          items: agenda.items.map((item) => {
            if (item.id === selectedTimeField.itemId) {
              return {
                ...item,
                [selectedTimeField.field]: time, // Time is already in the correct format
              }
            }
            return item
          }),
        }
      }
      return agenda
    })

    setAgendas(updatedAgendas)
    setSelectedTimeField(null)
    setOpenDropdownId(null)
  }

  const handleInputChange = (itemId: any, field: any, value: any) => {
    const updatedAgendas = agendas.map((agenda) => {
      if (agenda.id === activeAgenda) {
        return {
          ...agenda,
          items: agenda.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                [field]: value,
                isNew: false,
              }
            }
            return item
          }),
        }
      }
      return agenda
    })

    setAgendas(updatedAgendas)

    // Clear error when user types in a field
    if (field === 'title' && formErrors.title) {
      setFormErrors({ ...formErrors, title: '' })
    }
  }

  const validateItem = (item: AgendaItem) => {
    const errors: Record<string, string> = {}
    if (!item.title.trim()) {
      errors.title = "Title can't be left blank"
    }
    return errors
  }

  const handleDeleteItem = (itemId: string) => {
    const currentAgenda = agendas.find((agenda) => agenda.id === activeAgenda)
    if (!currentAgenda) return

    // If this is the only item in the agenda, don't delete it
    if (currentAgenda.items.length === 1) {
      // Show an error or warning message
      setFormErrors({
        ...formErrors,
        agenda:
          'You must have at least one agenda item or delete the entire agenda',
      })
      return
    }

    const updatedAgendas = agendas.map((agenda) => {
      if (agenda.id === activeAgenda) {
        return {
          ...agenda,
          items: agenda.items.filter((item) => item.id !== itemId),
        }
      }
      return agenda
    })

    setAgendas(updatedAgendas)
    setEditingItem(null)
  }

  const canDeleteItem = (item: AgendaItem) => {
    const currentAgenda = agendas.find((agenda) => agenda.id === activeAgenda)
    // Don't allow deletion if title is empty
    if (!item.title.trim()) {
      return false
    }

    // Only allow deletion if there's more than one item in the agenda
    return currentAgenda && currentAgenda.items.length > 1
  }

  const renderAgendaItem = (item: any) => {
    const isEditing = editingItem === item.id
    const errors = validateItem(item)
    const isDeleteButtonDisabled = !canDeleteItem(item)

    if (isEditing || item.isNew) {
      return (
        <div
          key={item.id}
          ref={editingRef}
          className="agenda-editing mt-4 bg-white-100 p-4 rounded-md border"
        >
          <div className="mb-4">
            <Input
              placeholder="Event Title (required)"
              value={item.title}
              onChange={(e) =>
                handleInputChange(item.id, 'title', e.target.value)
              }
              className={`w-full mb-4 ${formErrors.title ? 'border-red-500' : ''}`}
              autoFocus
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Button
                onClick={() => handleTimeClick('startTime', item.id)}
                className="flex items-center border rounded-md p-2 w-full text-black bg-white-100 hover:bg-slate-900 hover:text-white-100"
              >
                <Icon name="Clock" className="h-4 w-4 mr-2" />
                {item.startTime || 'Start time'}
              </Button>

              {/* Start Time Dropdown */}
              {selectedTimeField?.field === 'startTime' &&
                selectedTimeField?.itemId === item.id &&
                openDropdownId === item.id && (
                  <div className="absolute bg-white-100 border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 z-20">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex-1 relative font-light">
              <Button
                onClick={() => handleTimeClick('endTime', item.id)}
                className="flex items-center border rounded-md p-2 w-full text-black bg-white-100 hover:bg-slate-900 hover:text-white-100"
              >
                <Icon name="Clock" className="h-4 w-4 mr-2" />
                {item.endTime || 'End time'}
              </Button>

              {/* End Time Dropdown */}
              {selectedTimeField?.field === 'endTime' &&
                selectedTimeField?.itemId === item.id &&
                openDropdownId === item.id && (
                  <div className="absolute bg-white-100 border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 z-20">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="mb-4">
            <Textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleInputChange(item.id, 'description', e.target.value)
              }
              className="w-full"
            />
            <div className="text-right text-sm text-gray-500">
              {item.description.length} / 1000
            </div>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Host/Artist name"
              value={item.host}
              onChange={(e) =>
                handleInputChange(item.id, 'host', e.target.value)
              }
              className="w-full"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              className={`text-red-500 ${isDeleteButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() =>
                !isDeleteButtonDisabled && handleDeleteItem(item.id)
              }
              disabled={isDeleteButtonDisabled}
              title={
                !item.title.trim()
                  ? 'Please enter a title before deleting'
                  : agendas.find((a) => a.id === activeAgenda)?.items.length ===
                      1
                    ? 'You must have at least one agenda item or delete the entire agenda'
                    : ''
              }
            >
              <Icon name="Trash" className="h-5 w-5" />
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        key={item.id}
        className="mt-4 bg-lime-50 p-4 rounded-md border-l-4 border-l-lime-300"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {item.startTime}
              {item.endTime ? ` - ${item.endTime}` : ''}
            </p>
            <h4 className="font-medium">{item.title}</h4>
          </div>
          <button
            className="text-gray-500"
            onClick={() => setEditingItem(item.id)}
          >
            <Icon name="Edit" className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  const globalAgendaError = errors?.agenda
  const formAgendaError = formErrors?.agenda

  return (
    <div className="mb-6">
      <div className="relative rounded-md overflow-hidden border bg-white-100 p-6">
        <h3 className="text-lg font-bold mb-4">Agenda</h3>
        {(globalAgendaError || formAgendaError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">
              {globalAgendaError || formAgendaError}
            </p>
          </div>
        )}
        <p className="text-gray-600 mb-4">
          Add an itinerary, schedule, or lineup to your event. You can include a
          time, a description of what will happen, and who will host or perform
          during the event. (Ex. Speaker, performer, artist, guide, etc.) If
          your event has multiple dates, you can add a second agenda.
        </p>

        {/* Agenda Tabs */}
        <div className="flex items-center mb-6 border-b">
          {agendas.map((agenda) => (
            <div
              key={agenda.id}
              className={`flex items-center mr-4 pb-2 ${agenda.active ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              {renamingAgendaId === agenda.id ? (
                <Input
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                  className="w-32"
                  autoFocus
                />
              ) : (
                <span
                  className="mr-2 cursor-pointer"
                  onClick={() => handleAgendaTabClick(agenda.id)}
                >
                  {agenda.title || 'Untitled agenda'}
                </span>
              )}

              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenForAgenda(
                      menuOpenForAgenda === agenda.id ? null : agenda.id,
                    )
                  }
                >
                  <Icon name="MoreVertical" className="h-4 w-4" />
                </button>
                {menuOpenForAgenda === agenda.id && (
                  <div className="absolute bg-white-100 shadow-lg rounded-md py-2 z-10">
                    <button
                      className="block w-full px-4 py-1 text-left hover:bg-gray-100"
                      onClick={() => handleRenameAgenda(agenda.id)}
                    >
                      Rename
                    </button>
                    <button
                      className="block w-full px-4 py-1 text-left text-red-500 hover:bg-gray-100"
                      onClick={() => handleDeleteAgenda(agenda.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {showAgendaForm ? (
            <div className="flex items-center pb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateNewAgenda}
              >
                <Icon name="Plus" /> Agenda
              </Button>
            </div>
          ) : (
            <button
              className="text-blue-500 flex items-center"
              onClick={handleAddNewAgenda}
            >
              <Icon name="Plus" className="h-4 w-4 mr-1" />
              Add new agenda
            </button>
          )}
        </div>

        {/* Agenda Items */}
        <div>
          {activeAgenda &&
            agendas
              .find((agenda) => agenda.id === activeAgenda)
              ?.items.map((item) => renderAgendaItem(item))}

          {activeAgenda &&
            agendas.find((agenda) => agenda.id === activeAgenda)?.items
              .length === 0 && (
              <div className="text-center p-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  No agenda items yet. Add your first item below.
                </p>
              </div>
            )}
        </div>

        {/* Add Slot Button */}
        {agendas.length > 0 && activeAgenda && (
          <button
            className="w-full mt-4 py-3 bg-gray-100 rounded-md text-blue-500 flex items-center justify-center"
            onClick={handleAddSlot}
          >
            <Icon name="Plus" className="h-4 w-4 mr-1" />
            Add slot
          </button>
        )}

        {/* Time Dropdown */}
        {showTimeDropdown && (
          <div
            className="absolute z-10 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="p-2">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectTime(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventAgenda

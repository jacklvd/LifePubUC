/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Icon } from '@/components/icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface AdditionalProps {
  highlights: {
    ageRestriction?: string
    doorTime?: string
    parkingInfo?: string
  }
  faqs: Array<{
    question: string
    answer: string
  }>
  onUpdateHighlights: (highlights: any) => void
  onUpdateFaqs: (faqs: any) => void
}

const EventAdditional: React.FC<AdditionalProps> = ({
  highlights = {},
  faqs = [],
  onUpdateHighlights,
  onUpdateFaqs,
}) => {
  const [showHighlightsDialog, setShowHighlightsDialog] = useState(false)
  const [showFaqDialog, setShowFaqDialog] = useState(false)
  const [highlightType, setHighlightType] = useState<
    'age' | 'door' | 'parking' | ''
  >('')
  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' })
  const [doorTimeValue, setDoorTimeValue] = useState('')
  const [doorTimeUnit, setDoorTimeUnit] = useState('Minutes')
  const [ageRestriction, setAgeRestriction] = useState('all')
  const [parkingType, setParkingType] = useState('free')
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null)

  const handleRemoveHighlight = (type: 'age' | 'door' | 'parking') => {
    const updatedHighlights = { ...highlights };
    delete updatedHighlights[type === 'age' ? 'ageRestriction' : type === 'door' ? 'doorTime' : 'parkingInfo'];
    onUpdateHighlights(updatedHighlights);
  };


  const handleOpenHighlightsDialog = (type: 'age' | 'door' | 'parking') => {
    setHighlightType(type)
    setShowHighlightsDialog(true)
  }

  const handleSaveHighlight = () => {
    if (highlightType === 'age') {
      onUpdateHighlights({ ...highlights, ageRestriction })
    } else if (highlightType === 'door') {
      onUpdateHighlights({
        ...highlights,
        doorTime: `${doorTimeValue} ${doorTimeUnit}`,
      })
    } else if (highlightType === 'parking') {
      onUpdateHighlights({ ...highlights, parkingInfo: parkingType })
    }
    setShowHighlightsDialog(false)
  }

  const handleOpenFaqDialog = (index?: number) => {
    if (index !== undefined && index >= 0) {
      setCurrentFaq(faqs[index])
      setEditingFaqIndex(index)
    } else {
      setCurrentFaq({ question: '', answer: '' })
      setEditingFaqIndex(null)
    }
    setShowFaqDialog(true)
  }

  const handleSaveFaq = () => {
    if (currentFaq.question.trim() === '' || currentFaq.answer.trim() === '') {
      return
    }

    if (editingFaqIndex !== null) {
      const updatedFaqs = [...faqs]
      updatedFaqs[editingFaqIndex] = currentFaq
      onUpdateFaqs(updatedFaqs)
    } else {
      onUpdateFaqs([...faqs, currentFaq])
    }
    setShowFaqDialog(false)
  }

  const handleDeleteFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index)
    onUpdateFaqs(updatedFaqs)
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative rounded-md overflow-hidden border bg-white-100 p-6">
          <h3 className="text-lg font-bold mb-4">Good to know</h3>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Highlights</h4>
            <div className="flex flex-wrap gap-2">
              {/* Age Restriction */}
              {!highlights.ageRestriction && (
                <Button variant="outline" size="sm" className="rounded-md" onClick={() => handleOpenHighlightsDialog('age')}>
                  <Icon name="Plus" className="h-4 w-4 mr-1" />
                  <span>Add Age info</span>
                </Button>
              )}
              {highlights.ageRestriction && (
                <Badge variant="secondary" className="cursor-pointer flex items-center">
                  {highlights.ageRestriction === 'all' ? 'All ages allowed' :
                    highlights.ageRestriction === 'restricted' ? 'Age restriction applies' : 'Parent/guardian needed'}
                  <button onClick={() => handleRemoveHighlight('age')} className="ml-2 text-blue-300 hover:text-blue-500">
                    <Icon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Door Time */}
              {!highlights.doorTime && (
                <Button variant="outline" size="sm" className="rounded-md" onClick={() => handleOpenHighlightsDialog('door')}>
                  <Icon name="Plus" className="h-4 w-4 mr-1" />
                  <span>Add Door Time</span>
                </Button>
              )}
              {highlights.doorTime && (
                <Badge variant="secondary" className="cursor-pointer flex items-center">
                  Door opens: {highlights.doorTime} before event
                  <button onClick={() => handleRemoveHighlight('door')} className="ml-2 text-blue-300 hover:text-blue-500">
                    <Icon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Parking Info */}
              {!highlights.parkingInfo && (
                <Button variant="outline" size="sm" className="rounded-md" onClick={() => handleOpenHighlightsDialog('parking')}>
                  <Icon name="Plus" className="h-4 w-4 mr-1" />
                  <span>Add Parking info</span>
                </Button>
              )}
              {highlights.parkingInfo && (
                <Badge variant="secondary" className="cursor-pointer flex items-center">
                  {highlights.parkingInfo === 'free' ? 'Free parking' :
                    highlights.parkingInfo === 'paid' ? 'Paid parking' : 'No parking options'}
                  <button onClick={() => handleRemoveHighlight('parking')} className="ml-2 text-blue-300 hover:text-blue-500">
                    <Icon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>

          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Frequently asked questions</h4>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleOpenFaqDialog()}
              >
                <Icon name="Plus" className="h-4 w-4 mr-1" />
                <span>Add question</span>
              </Button>
            </div>

            {faqs.length === 0 && (
              <div className="border rounded-md p-4 mb-3 bg-blue-50 flex items-center">
                <Icon name="Info" className="h-5 w-5 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">
                    Boost your event visibility
                  </p>
                  <p className="text-sm text-gray-600">
                    Events with FAQs have 8% more organic traffic. Help
                    attendees find answers easily.
                  </p>
                </div>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="border rounded-md mb-3 overflow-hidden">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full divide-y"
                >
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-0"
                    >
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1 hover:underline py-3 px-4">
                          <span className="font-medium text-left">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <div className="flex pr-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenFaqDialog(index)
                            }}
                            className="mr-1 text-gray-500 hover:text-gray-700"
                          >
                            <Icon name="Pencil" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFaq(index)
                            }}
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <Icon name="Trash" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent className="px-4 pb-3 pt-0 text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => handleOpenFaqDialog()}
                >
                  <Icon name="Plus" className="h-4 w-4 mr-1" />
                  <span>Add another question</span>
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
          >
            <Icon name="Plus" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Highlight Dialog */}
      <Dialog
        open={showHighlightsDialog}
        onOpenChange={setShowHighlightsDialog}
      >
        <DialogContent className="sm:max-w-md bg-white-100">
          <DialogHeader>
            <DialogTitle>
              {highlightType === 'age' && 'Add age restriction'}
              {highlightType === 'door' &&
                'What time can attendees check in before the event?'}
              {highlightType === 'parking' && 'Is there parking at your venue?'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {highlightType === 'age' && (
              <RadioGroup
                value={ageRestriction}
                onValueChange={setAgeRestriction}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="all" id="all-ages" />
                  <Label htmlFor="all-ages">All ages allowed</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted">
                    There&apos;s an age restriction
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="guardian" id="guardian" />
                  <Label htmlFor="guardian">Parent or guardian needed</Label>
                </div>
              </RadioGroup>
            )}

            {highlightType === 'door' && (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={doorTimeValue}
                    onChange={(e) => setDoorTimeValue(e.target.value)}
                    placeholder="30"
                    min="0"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={doorTimeUnit === 'Minutes' ? 'default' : 'outline'}
                    onClick={() => setDoorTimeUnit('Minutes')}
                  >
                    Minutes
                  </Button>
                  <Button
                    variant={doorTimeUnit === 'Hours' ? 'default' : 'outline'}
                    onClick={() => setDoorTimeUnit('Hours')}
                  >
                    Hours
                  </Button>
                </div>
              </div>
            )}

            {highlightType === 'parking' && (
              <RadioGroup
                value={parkingType}
                onValueChange={setParkingType}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="free" id="free-parking" />
                  <Label htmlFor="free-parking">Free parking</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="paid" id="paid-parking" />
                  <Label htmlFor="paid-parking">Paid parking</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="none" id="no-parking" />
                  <Label htmlFor="no-parking">No parking options</Label>
                </div>
              </RadioGroup>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveHighlight}
              className="bg-blue-50 text-black hover:bg-blue-500"
            >
              Add to event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={showFaqDialog} onOpenChange={setShowFaqDialog}>
        <DialogContent className="sm:max-w-md bg-white-100">
          <DialogHeader>
            <DialogTitle>
              {editingFaqIndex !== null ? 'Edit question' : 'Add question'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">
                Question <span className="text-red-500">*</span>
              </Label>
              <Input
                id="question"
                value={currentFaq.question}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, question: e.target.value })
                }
                placeholder="E.g., Is there a dress code for this event?"
                required
                className="focus:border-blue-400 focus:ring-blue-400"
              />
              {currentFaq.question.trim() === '' && (
                <p className="text-red-500 text-sm">
                  A question is required for this section
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">
                Answer <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="answer"
                value={currentFaq.answer}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, answer: e.target.value })
                }
                placeholder="Provide a clear and concise answer to help your attendees"
                required
                rows={4}
                className="focus:border-blue-400 focus:ring-blue-400"
                maxLength={300}
              />
              {currentFaq.answer.trim() === '' && (
                <p className="text-red-500 text-sm">
                  An answer is required for this section
                </p>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span
                  className={
                    currentFaq.answer.length > 280 ? 'text-amber-600' : ''
                  }
                >
                  {currentFaq.answer.length > 280
                    ? 'Keep it concise for better readability'
                    : ''}
                </span>
                <span
                  className={
                    currentFaq.answer.length > 280
                      ? 'text-amber-600 font-medium'
                      : ''
                  }
                >
                  {currentFaq.answer.length} / 300
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setShowFaqDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveFaq}
              disabled={
                !currentFaq.question.trim() || !currentFaq.answer.trim()
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingFaqIndex !== null ? 'Save changes' : 'Add question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EventAdditional

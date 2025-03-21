// Create a new component: TicketDatePicker.tsx

import React from 'react';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons';

interface TicketDatePickerProps {
    label: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    disabledDates?: (date: Date) => boolean;
}

const TicketDatePicker = ({
    label,
    date,
    setDate,
    isOpen,
    setIsOpen,
    disabledDates
}: TicketDatePickerProps) => {
    return (
        <div>
            <label className="text-sm">{label}*</label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {date ? format(date, 'MM/dd/yyyy') : 'Select date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            console.log("Date selected:", newDate);
                            if (newDate) {
                                setDate(newDate);
                                setIsOpen(false);
                            }
                        }}
                        disabled={disabledDates}
                        initialFocus
                        className='bg-white-100'
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TicketDatePicker;
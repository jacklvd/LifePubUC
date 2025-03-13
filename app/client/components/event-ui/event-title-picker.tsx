import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icon } from '../icons';

interface Props {
    title: string;
    summary: string;
    error?: string;
    onTitleChange: (title: string) => void;
    onSummaryChange: (summary: string) => void;
}

const EventTitleInput = ({ title, summary, error, onTitleChange, onSummaryChange }: Props) => {
    return (
        <div className="relative rounded-md border bg-white-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Event Overview</h2>
            <p className="text-gray-600 text-sm mb-4">
                Give your event a title that stands out.
            </p>
            <Input
                placeholder="A wonderful title for your event."
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-gray-600 text-sm mb-4 pt-3">
                A brief description of your event.
            </p>

            <Input
                placeholder="A short and sweet sentence about your event."
                value={summary}
                onChange={(e) => onSummaryChange(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <Button
                variant="ghost"
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border"
            >
                <Icon name="Plus" className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default EventTitleInput;

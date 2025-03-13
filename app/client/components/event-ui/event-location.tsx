import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons';

interface Props {
    locationName: string;
    handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLocationSearch: () => void;
    locationSuggestions: LocationSuggestion[];
    showSuggestions: boolean;
    handleSelectSuggestion: (suggestion: LocationSuggestion) => void;
    showMap: boolean;
    toggleMap: () => void;
    errors: Record<string, string>;
    locationInputRef: React.RefObject<HTMLInputElement>;
}

const EventLocationPicker = ({
    locationName,
    handleLocationChange,
    handleLocationSearch,
    locationSuggestions,
    showSuggestions,
    handleSelectSuggestion,
    showMap,
    toggleMap,
    errors,
    locationInputRef,
}: Props) => {
    return (
        <>
            <h3 className="text-lg font-medium mb-4">Location</h3>
            {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
            <div className="flex flex-col">
                <div className="flex items-center mb-2 relative" ref={locationInputRef}>
                    <Input

                        placeholder="Enter a location"
                        className="mr-2"
                        value={locationName}
                        onChange={handleLocationChange}
                    />



                    <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={handleLocationSearch}
                    >
                        <Icon name="Search" className="h-4 w-4" />
                    </Button>

                    {/* Location Suggestions */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-12 mt-1 bg-white-100 border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {locationSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion.place_id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Button
                    variant="link"
                    className="text-blue-500 mt-1 h-auto p-0 self-start"
                    onClick={toggleMap}
                >
                    <span>{showMap ? 'Hide map' : 'Show map'}</span>
                </Button>
            </div>
        </>

    );
};

export default EventLocationPicker;

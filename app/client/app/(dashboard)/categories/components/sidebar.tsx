import React from 'react'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'

interface SidebarProps {
    show: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    priceRange: [number, number];
    onPriceChange: (value: [number, number]) => void;
    // availabilityFilters: AvailabilityFilters;
    // onAvailabilityChange: (key: keyof AvailabilityFilters, checked: boolean) => void;
    categories: Category[];
    selectedCategory: string | null;
    onCategorySelect: (category: string) => void;
  }
  
  
const Sidebar = ({ 
  show,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceChange,
//   availabilityFilters,
//   onAvailabilityChange,
  categories,
  selectedCategory,
  onCategorySelect
}: SidebarProps) => {
  return (
    <div className={`w-full md:w-64 shrink-0 transition-all ${show ? 'block' : 'hidden md:block'}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
        <div className="mb-6">
          <h3 className="font-medium mb-2">Search Items</h3>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="price">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <Slider
                
                  value={priceRange}
                  max={1000}
                  step={10}
                  onValueChange={onPriceChange}
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* <AccordionItem value="availability">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inStock" 
                    checked={availabilityFilters.inStock}
                    onCheckedChange={(checked) => onAvailabilityChange('inStock', checked)}
                  />
                  <label htmlFor="inStock" className="text-sm">In Stock</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="preOrder" 
                    checked={availabilityFilters.preOrder}
                    onCheckedChange={(checked) => onAvailabilityChange('preOrder', checked)}
                  />
                  <label htmlFor="preOrder" className="text-sm">Pre-order</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="limitedEdition" 
                    checked={availabilityFilters.limitedEdition}
                    onCheckedChange={(checked) => onAvailabilityChange('limitedEdition', checked)}
                  />
                  <label htmlFor="limitedEdition" className="text-sm">Limited Edition</label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem> */}

          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${category.title}`} 
                      checked={selectedCategory === category.title}
                      onCheckedChange={() => onCategorySelect(category.title)}
                    />
                    <label htmlFor={`cat-${category.title}`} className="text-sm">{category.title}</label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default Sidebar
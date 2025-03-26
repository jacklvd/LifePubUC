import React, { ChangeEvent } from 'react'


interface FormData {
    title: string
    description: string
    category: string
    condition: string
    price: PriceData
    images: File[]
  }

interface FormErrors {
    title?: string
    description?: string
    category?: string
    condition?: string
    price?: string
    images?: string
    form?: string
  }

interface PricingSectionProps {
    activeSection: string,
    formData: FormData,
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    errors: FormErrors
}


const PricingSection = ({ activeSection, formData, handleChange, errors}: PricingSectionProps) => {
    return (
        <> {activeSection === 'pricing' && (
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>

                <div className="mb-6">
                    <label htmlFor="price" className="block font-medium mb-1">
                        Price
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                        </div>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`w-full pl-8 p-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'
                                } rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                        Set a fair price that reflects your item&apos;s condition and
                        value
                    </p>
                </div>
            </div>
        )}</>
    )
}

export default PricingSection
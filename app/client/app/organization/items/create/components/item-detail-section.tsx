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

interface ItemDetailSectionProps {
  activeSection: string
  formData: FormData
  errors: FormErrors
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  categories: string[]
  conditions: string[]
}

const ItemDetailSection = ({
  activeSection,
  formData,
  errors,
  handleChange,
  categories,
  conditions,
}: ItemDetailSectionProps) => {
  return (
    <>
      {activeSection === 'details' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Item details</h2>

          <div className="mb-6">
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData?.title || ''}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="What are you selling?"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Describe your item in detail - condition, features, what makes it special..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="condition" className="block font-medium mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ItemDetailSection

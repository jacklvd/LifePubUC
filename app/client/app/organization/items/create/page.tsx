'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createItem } from '@/lib/actions/item-actions'

import PhotoSection from '../components/photo-section'
import ItemDetailSection from '../components/item-detail-section'

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

interface PriceData {
  amount: string | number
}

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'photos', label: 'Photos' },
  { id: 'details', label: 'Item details' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'review', label: 'Review' },
]

const CreateItemPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>('photos')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: {
      amount: '',
    },
    images: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const categories: string[] = [
    'Textbook',
    'Clothing & Accessories',
    'Home & Living',
    'Jewelry',
    'Craft Supplies',
    'Paper & Party Supplies',
    'Art & Collectibles',
    'Electronics',
    'Books',
    'Toys & Games',
    'Other',
  ]

  const conditions: string[] = ['New', 'Like New', 'Good', 'Fair', 'Poor']

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    if (name === 'price') {
      setFormData({
        ...formData,
        price: {
          ...formData.price,
          amount: parseFloat(value) || '',
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error for this field when user makes a change
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    const newPreviewImages = files.map((file) => URL.createObjectURL(file))

    setUploadedImages([...uploadedImages, ...files])
    setPreviewImages([...previewImages, ...newPreviewImages])

    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    })

    if (errors.images) {
      setErrors({
        ...errors,
        images: '',
      })
    }
  }

  const removeImage = (index: number) => {
    const updatedUploads = [...uploadedImages]
    const updatedPreviews = [...previewImages]
    const updatedFormImages = [...formData.images]

    updatedUploads.splice(index, 1)
    updatedPreviews.splice(index, 1)
    updatedFormImages.splice(index, 1)

    setUploadedImages(updatedUploads)
    setPreviewImages(updatedPreviews)
    setFormData({
      ...formData,
      images: updatedFormImages,
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim())
      newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.price.amount) newErrors.price = 'Price is required'
    if (typeof formData.price.amount === 'number' && formData.price.amount < 0)
      newErrors.price = 'Price cannot be negative'
    if (formData.images.length === 0)
      newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('condition', formData.condition)
      formDataToSend.append('price[amount]', formData.price.amount.toString())

      formData.images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const result = await createItem({ formData: formDataToSend })

      router.push(`/organization/items/${result.data._id}`)
    } catch (error) {
      console.error('Error creating item:', error)
      setErrors({
        ...errors,
        form:
          error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToSection = (sectionId: string) => {
    if (sectionId === 'review') {
      // Validate before going to review
      if (!validateForm()) {
        return
      }
    }
    setActiveSection(sectionId)
  }

  const goToNextSection = () => {
    const currentIndex = sections.findIndex(
      (section) => section.id === activeSection,
    )
    if (currentIndex < sections.length - 1) {
      goToSection(sections[currentIndex + 1].id)
    }
  }

  const goToPrevSection = () => {
    const currentIndex = sections.findIndex(
      (section) => section.id === activeSection,
    )
    if (currentIndex > 0) {
      goToSection(sections[currentIndex - 1].id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Create a new listing</h1>

      <div className="mb-8">
        <div className="flex flex-wrap mb-4">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                type="button"
                onClick={() => goToSection(section.id)}
                className={`px-3 py-1 ${activeSection === section.id
                    ? 'font-semibold text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500'
                  }`}
              >
                {section.label}
              </button>
              {index < sections.length - 1 && (
                <span className="mx-2 text-gray-300">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {errors.form && (
        <div className="bg-red-50 text-red-500 p-4 mb-6 rounded">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Photos Section */}
        <PhotoSection
          activeSection={activeSection}
          previewImages={previewImages}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />

        {/* Item Details Section */}
        <ItemDetailSection
          activeSection={activeSection}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          categories={categories}
          conditions={conditions}
        />

        {/* Pricing Section */}
        {activeSection === 'pricing' && (
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
        )}

        {/* Review Section */}
        {activeSection === 'review' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Review your listing</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {/* Images preview */}
                  <div className="border border-gray-200 rounded overflow-hidden mb-4">
                    {previewImages.length > 0 ? (
                      <Image
                        src={previewImages[0]}
                        width={400}
                        height={400}
                        alt="Item preview"
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {previewImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {previewImages.slice(1, 6).map((src, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded overflow-hidden"
                        >
                          <Image
                            src={src}
                            width={400}
                            height={400}
                            alt={`Preview ${index + 2}`}
                            className="w-full h-14 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {formData.title || 'No title'}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mb-4">
                    $
                    {typeof formData.price.amount === 'number'
                      ? formData.price.amount.toFixed(2)
                      : parseFloat(formData.price.amount || '0').toFixed(2)}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700">Category</h4>
                    <p>{formData.category || 'Not specified'}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700">Condition</h4>
                    <p>{formData.condition || 'Not specified'}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {formData.description || 'No description'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {activeSection !== 'photos' && (
            <button
              type="button"
              onClick={goToPrevSection}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50"
            >
              Back
            </button>
          )}

          {activeSection !== 'review' ? (
            <button
              type="button"
              onClick={goToNextSection}
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 ml-auto"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 ml-auto disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating listing...' : 'Create listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default CreateItemPage

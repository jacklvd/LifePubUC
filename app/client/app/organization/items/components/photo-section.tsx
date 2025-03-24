import React, { ChangeEvent } from 'react'
import Image from 'next/image'

interface PhotoSectionProps {
  activeSection: string
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void
  previewImages: string[]
  removeImage: (index: number) => void
}

const PhotoSection = ({
  activeSection,
  handleImageUpload,
  previewImages,
  removeImage,
}: PhotoSectionProps) => {
  return (
    <>
      {activeSection === 'photos' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Add photos of your item
          </h2>
          <p className="text-gray-600 mb-4">
            Add up to 10 photos to show your item from all angles. Photos should
            be at least 1000px wide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {/* Image upload box */}
            <div className="border-2 border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-500">Add photos</span>
              </label>
            </div>

            {/* Preview images */}
            {previewImages.map((src: string, index: number) => (
              <div
                key={index}
                className="relative border border-gray-200 rounded overflow-hidden aspect-square"
              >
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoSection

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { UPLOAD_PRESET } from '@/constants'

interface Props {
  media?: string
  mediaType: 'image' | 'video'
  handleCloudinaryUpload: (result: any) => void
  handleRemoveMedia: () => void
  errors: Record<string, string>
}

const EventPhotoUpload = ({
  media,
  mediaType,
  handleCloudinaryUpload,
  handleRemoveMedia,
  errors,
}: Props) => {
  return (
    <div className="mb-6">
      <div className="relative rounded-md overflow-hidden border bg-white-100">
        <div className="h-64 flex items-center justify-center">
          {!media ? (
            <div className="flex flex-col items-center">
              <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-white">
                <Icon name="Upload" className="h-6 w-6 text-blue-500" />
              </div>
              <CldUploadWidget
                uploadPreset={UPLOAD_PRESET} // Make sure this matches your Cloudinary preset
                options={{
                  maxFiles: 1,
                  resourceType: 'auto',
                  clientAllowedFormats: [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'webp',
                    'svg',
                    'mp4',
                    'mov',
                  ],
                  maxFileSize: 10000000, // 10MB
                  sources: ['local', 'camera'],
                }}
                onSuccess={handleCloudinaryUpload}
              >
                {({ open }) => (
                  <Button variant="outline" onClick={() => open()}>
                    Upload an Image or a Video
                  </Button>
                )}
              </CldUploadWidget>
              {errors.media && (
                <p className="text-red-500 text-sm mt-1">{errors.media}</p>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              {mediaType === 'image' ? (
                <Image
                  src={media}
                  alt="Event media"
                  className="w-full h-full object-cover"
                  layout="fill"
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={media} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <Button
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white-100 shadow-md"
                onClick={handleRemoveMedia}
              >
                <Icon name="X" className="h-4 w-4 text-black" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPhotoUpload

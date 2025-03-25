/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react'
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

const EventPhotoUpload = memo(({
  media,
  mediaType,
  handleCloudinaryUpload,
  handleRemoveMedia,
  errors,
}: Props) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative rounded-md overflow-hidden border bg-white-100">
        <div className="h-40 sm:h-64 w-full flex items-center justify-center">
          {!media ? (
            <div className="flex flex-col items-center p-4 text-center">
              <div className="mb-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white">
                <Icon name="Upload" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
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
                  <Button
                    variant="outline"
                    onClick={() => open()}
                    className="text-xs sm:text-sm"
                    aria-label="Upload media"
                  >
                    Upload an Image or a Video
                  </Button>
                )}
              </CldUploadWidget>
              {errors.media && (
                <p className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.media}</p>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              {mediaType === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={media}
                    alt="Event media"
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                    loading="eager"
                  />
                </div>
              ) : (
                <video
                  controls
                  className="w-full h-full"
                  preload="metadata"
                  aria-label="Event video"
                >
                  <source src={media} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <Button
                variant="destructive"
                className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full bg-white-100 shadow-md"
                onClick={handleRemoveMedia}
                aria-label="Remove media"
              >
                <Icon name="X" className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
});

EventPhotoUpload.displayName = 'EventPhotoUpload';

export default EventPhotoUpload;
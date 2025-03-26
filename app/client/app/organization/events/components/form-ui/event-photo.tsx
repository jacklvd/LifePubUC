/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import Image from 'next/image'
// import { UPLOAD_PRESET } from '@/constants'

interface Props {
  media?: string
  mediaType: 'image' | 'video'
  localFile?: File | null
  handleFileSelect: (file: File) => void
  handleRemoveMedia: () => void
  errors: Record<string, string>
}

const EventPhotoUpload = memo(
  ({
    media,
    mediaType,
    localFile,
    handleFileSelect,
    handleRemoveMedia,
    errors,
  }: Props) => {
    // State to store the local object URL
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>(undefined);

    // Create or update the local preview URL when the file changes
    useEffect(() => {
      if (localFile) {
        const objectUrl = URL.createObjectURL(localFile);
        setLocalPreviewUrl(objectUrl);

        // Clean up function to revoke the object URL when component unmounts or file changes
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      }
    }, [localFile]);

    // Use local preview URL if available, otherwise use the remote media URL
    const previewUrl = localPreviewUrl || media;
    const previewType = localFile ?
      (localFile.type.startsWith('video/') ? 'video' : 'image') :
      mediaType;

    // Determine whether to show preview (either from localFile or remote media)
    const showPreview = !!(previewUrl);

    return (
      <div className="mb-4 sm:mb-6">
        <div className="relative rounded-md overflow-hidden border bg-white-100">
          <div className="h-40 sm:h-64 w-full flex items-center justify-center">
            {!showPreview ? (
              <div className="flex flex-col items-center p-4 text-center">
                <div className="mb-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white">
                  <Icon
                    name="Upload"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"
                  />
                </div>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0])
                    }
                  }}
                />
                <label htmlFor="fileInput">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm"
                    aria-label="Upload media"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    Upload an Image or a Video
                  </Button>
                </label>
                {errors.media && (
                  <p
                    className="text-red-500 text-xs sm:text-sm mt-1"
                    role="alert"
                  >
                    {errors.media}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                {previewType === 'image' ? (
                  <div className="relative w-full h-full">
                    {previewUrl && (
                      <Image
                        src={previewUrl}
                        alt="Event media"
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                        loading="eager"
                      />
                    )}
                  </div>
                ) : (
                  <video
                    controls
                    className="w-full h-full"
                    preload="metadata"
                    aria-label="Event video"
                  >
                    {previewUrl && <source src={previewUrl} type="video/mp4" />}
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
  },
)

EventPhotoUpload.displayName = 'EventPhotoUpload'

export default EventPhotoUpload
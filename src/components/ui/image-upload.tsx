'use client'

import * as React from 'react'
import { ImagePlus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  disabled?: boolean
  onChange(iamgeUrl: string): void
  onRemove(imageUrl: string): void
  value: string[]
}

export function ImageUpload(props: ImageUploadProps) {
  const { onChange, onRemove, value, disabled } = props

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  function onUpload(result: any) {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((imageUrl) => {
          return (
            <div
              key={imageUrl}
              className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
            >
              <div className='z-10 absolute top-2 right-2'>
                <Button
                  variant='destructive'
                  size='icon'
                  type='button'
                  onClick={() => onRemove(imageUrl)}
                >
                  <Trash className='w-4 h-4' />
                </Button>
              </div>

              <Image fill className='object-cover' alt='Image' src={imageUrl} />
            </div>
          )
        })}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset='fxutngiq'>
        {({ open }) => {
          return (
            <Button
              type='button'
              disabled={disabled}
              variant='secondary'
              onClick={() => open()}
            >
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

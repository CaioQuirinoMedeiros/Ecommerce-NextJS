'use client'

import * as React from 'react'
import { Billboard } from '@prisma/client'
import { Trash } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { AlertModal } from '@/components/modals/alert-modal'
import { ImageUpload } from '@/components/ui/image-upload'

interface BillboardFormsProps {
  initialData: Billboard | null
}

const storeFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1, { message: 'You should upload an image' })
})

type StoreFormData = z.input<typeof storeFormSchema>

export function BillboardForm(props: BillboardFormsProps) {
  const { initialData } = props

  const params = useParams()
  const router = useRouter()
  const form = useForm<StoreFormData>({
    defaultValues: {
      label: initialData?.label ?? '',
      imageUrl: initialData?.imageUrl ?? ''
    },
    resolver: zodResolver(storeFormSchema)
  })

  const storeId = params.storeId as string
  const billboardId = params.billboardId as string

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const title = initialData ? 'Edit Billboard' : 'Create Billboard'
  const description = initialData ? 'Edit a Billboard' : 'Add a new Billboard'
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function deleteBillboard() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`)
      router.refresh()
      router.push(`/${storeId}/billboards`)
      toast.success('Billboard deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleRemoveStore() {
    setIsAlertOpen(true)
  }

  async function onSubmit(formData: StoreFormData) {
    try {
      setIsSubmiting(true)

      if (initialData) {
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, {
          label: formData.label,
          imageUrl: formData.imageUrl
        })
      } else {
        await axios.post(`/api/${storeId}/billboards`, {
          label: formData.label,
          imageUrl: formData.imageUrl
        })
      }

      router.refresh()
      router.push(`/${storeId}/billboards`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {!!initialData && (
          <Button
            variant='destructive'
            size='icon'
            onClick={handleRemoveStore}
            disabled={isSubmiting}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(imageUrl) => field.onChange(imageUrl)}
                    onRemove={() => field.onChange('')}
                    disabled={isSubmiting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmiting}
                      placeholder='Billboard label'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmiting} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>

      <Separator />

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={deleteBillboard}
        isLoading={isDeleting}
      />
    </>
  )
}

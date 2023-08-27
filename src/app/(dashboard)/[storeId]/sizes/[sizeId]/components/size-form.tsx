'use client'

import * as React from 'react'
import { Size } from '@prisma/client'
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

interface SizeFormsProps {
  initialData: Size | null
}

const sizeFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
})

type SizeFormDaa = z.input<typeof sizeFormSchema>

export function SizeForm(props: SizeFormsProps) {
  const { initialData } = props

  const params = useParams()
  const router = useRouter()
  const form = useForm<SizeFormDaa>({
    defaultValues: {
      name: initialData?.name ?? '',
      value: initialData?.value ?? ''
    },
    resolver: zodResolver(sizeFormSchema)
  })

  const storeId = params.storeId as string
  const sizeId = params.sizeId as string

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const title = initialData ? 'Edit Size' : 'Create Size'
  const description = initialData ? 'Edit a Size' : 'Add a new Size'
  const toastMessage = initialData ? 'Size updated.' : 'Size created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function deleteSize() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`)
      router.refresh()
      router.push(`/${storeId}/sizes`)
      toast.success('Size deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleRemoveStore() {
    setIsAlertOpen(true)
  }

  async function onSubmit(formData: SizeFormDaa) {
    try {
      setIsSubmiting(true)

      if (initialData) {
        await axios.patch(`/api/${storeId}/sizes/${sizeId}`, {
          name: formData.name,
          value: formData.value
        })
      } else {
        await axios.post(`/api/${storeId}/sizes`, {
          name: formData.name,
          value: formData.value
        })
      }

      router.refresh()
      router.push(`/${storeId}/sizes`)
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
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmiting}
                      placeholder='Size name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmiting}
                      placeholder='Size value'
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
        onConfirm={deleteSize}
        isLoading={isDeleting}
      />
    </>
  )
}

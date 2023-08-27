'use client'

import * as React from 'react'
import { Color } from '@prisma/client'
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

interface ColorFormsProps {
  initialData: Color | null
}

const colorFormSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      message: 'Color value must be a valid hex code'
    })
})

type ColorFormDaa = z.input<typeof colorFormSchema>

export function ColorForm(props: ColorFormsProps) {
  const { initialData } = props

  const params = useParams()
  const router = useRouter()
  const form = useForm<ColorFormDaa>({
    defaultValues: {
      name: initialData?.name ?? '',
      value: initialData?.value ?? ''
    },
    resolver: zodResolver(colorFormSchema)
  })

  const storeId = params.storeId as string
  const colorId = params.colorId as string

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const title = initialData ? 'Edit Color' : 'Create Color'
  const description = initialData ? 'Edit a Color' : 'Add a new Color'
  const toastMessage = initialData ? 'Color updated.' : 'Color created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function deleteColor() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/colors/${colorId}`)
      router.refresh()
      router.push(`/${storeId}/colors`)
      toast.success('Color deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleRemoveStore() {
    setIsAlertOpen(true)
  }

  async function onSubmit(formData: ColorFormDaa) {
    try {
      setIsSubmiting(true)

      if (initialData) {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, {
          name: formData.name,
          value: formData.value
        })
      } else {
        await axios.post(`/api/${storeId}/colors`, {
          name: formData.name,
          value: formData.value
        })
      }

      router.refresh()
      router.push(`/${storeId}/colors`)
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
            color='icon'
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
                      placeholder='Color name'
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
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={isSubmiting}
                        placeholder='Color value'
                        {...field}
                      />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
        onConfirm={deleteColor}
        isLoading={isDeleting}
      />
    </>
  )
}

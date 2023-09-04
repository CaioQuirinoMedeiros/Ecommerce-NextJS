'use client'

import * as React from 'react'
import { Store } from '@prisma/client'
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
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingsFormsProps {
  initialData: Store
}

const storeFormSchema = z.object({
  name: z.string().min(1)
})

type StoreFormData = z.input<typeof storeFormSchema>

export function SettingsForm(props: SettingsFormsProps) {
  const { initialData } = props

  const origin = useOrigin()
  const params = useParams()
  const router = useRouter()
  const form = useForm<StoreFormData>({
    defaultValues: initialData,
    resolver: zodResolver(storeFormSchema)
  })

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  async function deleteStore() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')
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

      await axios.patch(`/api/stores/${params.storeId}`, {
        name: formData.name
      })

      router.refresh()
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button
          variant='destructive'
          size='icon'
          onClick={handleRemoveStore}
          disabled={isSubmiting}
        >
          <Trash className='h-4 w-4' />
        </Button>
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
                      placeholder='Store name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmiting} className='ml-auto' type='submit'>
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${params.storeId}`}
        variant='public'
      />

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={deleteStore}
        isLoading={isDeleting}
      />
    </>
  )
}

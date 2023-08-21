'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import { useStoreModalStore } from '@/hooks/use-store-modal-store'
import { Modal } from '@/components/ui/modal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { handleAxiosError } from '@/utils/handleAxiosError'

const storeModalFormSchema = z.object({
  name: z.string().min(1)
})

type StoreModalFormData = z.input<typeof storeModalFormSchema>

type CreateStoreResponseBody = {
  store: { id: string }
}

export function StoreModal() {
  const storeModalStore = useStoreModalStore()

  const [isSubmiting, setIsSubmiting] = React.useState(false)

  const form = useForm<StoreModalFormData>({
    defaultValues: { name: '' },
    resolver: zodResolver(storeModalFormSchema)
  })

  async function onSubmit(formData: StoreModalFormData) {
    try {
      setIsSubmiting(true)
      const response = await axios.post<CreateStoreResponseBody>(
        '/api/stores',
        { name: formData.name }
      )
      window.location.assign(`/${response.data.store.id}`)
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <Modal
      title='Create store'
      description='Add a new store to manage products and categories'
      isOpen={storeModalStore.isOpen}
      onClose={storeModalStore.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmiting}
                        placeholder='E-Commerce'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors?.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={storeModalStore.onClose}
                  disabled={isSubmiting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmiting}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

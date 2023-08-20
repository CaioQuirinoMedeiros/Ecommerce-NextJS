'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

import { useStoreModalStore } from '@/hoos/use-store-modal-store'
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

const storeModalFormSchema = z.object({
  name: z.string().min(1)
})

type StoreModalFormData = z.input<typeof storeModalFormSchema>

export function StoreModal() {
  const storeModalStore = useStoreModalStore()

  const form = useForm<StoreModalFormData>({
    defaultValues: { name: '' },
    resolver: zodResolver(storeModalFormSchema)
  })

  async function onSubmit(formData: StoreModalFormData) {
    console.log(formData)
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
                      <Input placeholder='E-Commerce' {...field} />
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
                >
                  Cancel
                </Button>
                <Button type='submit'>Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

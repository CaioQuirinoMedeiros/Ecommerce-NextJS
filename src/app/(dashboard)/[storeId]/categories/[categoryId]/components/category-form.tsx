'use client'

import * as React from 'react'
import { Billboard, Category } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface CategoryFormsProps {
  initialData: Category | null
  billboards: Billboard[]
}

const categoryFormSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

type CategoryFormDaa = z.input<typeof categoryFormSchema>

export function CategoryForm(props: CategoryFormsProps) {
  const { initialData, billboards } = props

  const params = useParams()
  const router = useRouter()
  const form = useForm<CategoryFormDaa>({
    defaultValues: {
      name: initialData?.name ?? '',
      billboardId: initialData?.billboardId ?? ''
    },
    resolver: zodResolver(categoryFormSchema)
  })

  const storeId = params.storeId as string
  const categoryId = params.categoryId as string

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const title = initialData ? 'Edit Category' : 'Create Category'
  const description = initialData ? 'Edit a Category' : 'Add a new Category'
  const toastMessage = initialData ? 'Category updated.' : 'Category created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function deleteCategory() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/categories/${categoryId}`)
      router.refresh()
      router.push(`/${storeId}/categories`)
      toast.success('Category deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleRemoveStore() {
    setIsAlertOpen(true)
  }

  async function onSubmit(formData: CategoryFormDaa) {
    try {
      setIsSubmiting(true)

      if (initialData) {
        await axios.patch(`/api/${storeId}/categories/${categoryId}`, {
          name: formData.name,
          billboardId: formData.billboardId
        })
      } else {
        await axios.post(`/api/${storeId}/categories`, {
          name: formData.name,
          billboardId: formData.billboardId
        })
      }

      router.refresh()
      router.push(`/${storeId}/categories`)
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
                      placeholder='Category name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isSubmiting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select a billboard'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => {
                        return (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
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
        onConfirm={deleteCategory}
        isLoading={isDeleting}
      />
    </>
  )
}

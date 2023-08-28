'use client'

import * as React from 'react'
import { Category, Color, Prisma, Size } from '@prisma/client'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { AlertModal } from '@/components/modals/alert-modal'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductFormsProps {
  initialData: Prisma.ProductGetPayload<{ include: { images: true } }> | null
  categories: Category[]
  sizes: Size[]
  colors: Color[]
}

const productFormSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  images: z.object({ url: z.string().url() }).array()
})

type ProductFormData = z.input<typeof productFormSchema>

export function ProductForm(props: ProductFormsProps) {
  const { initialData, categories, sizes, colors } = props

  console.log({
    price: initialData?.price,
    typeof: typeof initialData?.price,
    typeofF: typeof initialData?.price?.toNumber
  })

  const params = useParams()
  const router = useRouter()
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name ?? '',
      price: initialData ? parseFloat(initialData?.price?.toString()) : 0,
      categoryId: initialData?.categoryId ?? '',
      colorId: initialData?.colorId ?? '',
      sizeId: initialData?.sizeId ?? '',
      isFeatured: initialData?.isFeatured ?? false,
      isArchived: initialData?.isArchived ?? false,
      images: initialData?.images ?? []
    },
    resolver: zodResolver(productFormSchema)
  })

  const storeId = params.storeId as string
  const productId = params.productId as string

  const [isSubmiting, setIsSubmiting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const title = initialData ? 'Edit Product' : 'Create Product'
  const description = initialData ? 'Edit a Product' : 'Add a new Product'
  const toastMessage = initialData ? 'Product updated.' : 'Product created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function deleteProduct() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/products/${productId}`)
      router.refresh()
      router.push(`/${storeId}/products`)
      toast.success('Product deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleRemoveStore() {
    setIsAlertOpen(true)
  }

  async function onSubmit(formData: ProductFormData) {
    try {
      setIsSubmiting(true)

      if (initialData) {
        await axios.patch(`/api/${storeId}/products/${productId}`, {
          name: formData.name,
          images: formData.images,
          price: formData.price,
          sizeId: formData.sizeId,
          colorId: formData.colorId,
          categoryId: formData.categoryId,
          isArchived: formData.isArchived,
          isFeatured: formData.isFeatured
        })
      } else {
        await axios.post(`/api/${storeId}/products`, {
          name: formData.name,
          images: formData.images,
          price: formData.price,
          sizeId: formData.sizeId,
          colorId: formData.colorId,
          categoryId: formData.categoryId,
          isArchived: formData.isArchived,
          isFeatured: formData.isFeatured
        })
      }

      router.refresh()
      router.push(`/${storeId}/products`)
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
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    onChange={(imageUrl) =>
                      field.onChange([...field.value, { url: imageUrl }])
                    }
                    onRemove={(imageUrl) =>
                      field.onChange(
                        field.value.filter((image) => {
                          return image.url !== imageUrl
                        })
                      )
                    }
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmiting}
                      placeholder='Product label'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={isSubmiting}
                      placeholder='9.99'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder='Select a category'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => {
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sizeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                          placeholder='Select a size'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => {
                        return (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='colorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder='Select a color'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => {
                        return (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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
        onConfirm={deleteProduct}
        isLoading={isDeleting}
      />
    </>
  )
}

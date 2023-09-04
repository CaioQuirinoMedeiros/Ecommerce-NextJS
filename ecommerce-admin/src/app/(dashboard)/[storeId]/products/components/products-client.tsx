'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

import { ProductItem, productsColumns } from './products-columns'

interface ProductsClientProps {
  productsItems: ProductItem[]
}

export function ProductsClient(props: ProductsClientProps) {
  const { productsItems } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewProduct() {
    router.push(`/${params.storeId}/products/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Products (${productsItems.length})`}
          description='Manage products for your store'
        />

        <Button onClick={handleAddNewProduct}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        data={productsItems}
        columns={productsColumns}
        searchKey='name'
      />

      <Heading title='API' description='API calls for Products' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}

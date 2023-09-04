'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

import { CategoryItem, categoriesColumns } from './categories-columns'

interface CategoriesClientProps {
  categoriesItems: CategoryItem[]
}

export function CategoriesClient(props: CategoriesClientProps) {
  const { categoriesItems } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewBillboard() {
    router.push(`/${params.storeId}/categories/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Categories (${categoriesItems.length})`}
          description='Manage categories for your store'
        />

        <Button onClick={handleAddNewBillboard}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        data={categoriesItems}
        columns={categoriesColumns}
        searchKey='name'
      />

      <Heading title='API' description='API calls for Categories' />
      <Separator />
      <ApiList entityName='categories' entityIdName='categoryId' />
    </>
  )
}

'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

import { SizeItem, sizesColumns } from './sizes-columns'

interface SizesClientProps {
  sizesItems: SizeItem[]
}

export function SizesClient(props: SizesClientProps) {
  const { sizesItems } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewBillboard() {
    router.push(`/${params.storeId}/sizes/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${sizesItems.length})`}
          description='Manage sizes for your store'
        />

        <Button onClick={handleAddNewBillboard}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        data={sizesItems}
        columns={sizesColumns}
        searchKey='name'
      />

      <Heading title='API' description='API calls for Sizes' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  )
}

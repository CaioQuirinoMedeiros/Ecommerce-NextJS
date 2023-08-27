'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

import { ColorItem, colorsColumns } from './colors-columns'

interface ColorsClientProps {
  colorsItems: ColorItem[]
}

export function ColorsClient(props: ColorsClientProps) {
  const { colorsItems } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewBillboard() {
    router.push(`/${params.storeId}/colors/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Colors (${colorsItems.length})`}
          description='Manage colors for your store'
        />

        <Button onClick={handleAddNewBillboard}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        data={colorsItems}
        columns={colorsColumns}
        searchKey='name'
      />

      <Heading title='API' description='API calls for Colors' />
      <Separator />
      <ApiList entityName='colors' entityIdName='colorId' />
    </>
  )
}

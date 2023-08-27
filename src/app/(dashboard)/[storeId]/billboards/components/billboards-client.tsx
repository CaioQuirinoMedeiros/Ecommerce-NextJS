'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

import { BillboardItem, billboardsColumns } from './billboards-columns'

interface BillboardsClientProps {
  billboardsItems: BillboardItem[]
}

export function BillboardsClient(props: BillboardsClientProps) {
  const { billboardsItems } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewBillboard() {
    router.push(`/${params.storeId}/billboards/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${billboardsItems.length})`}
          description='Manage billboards for your store'
        />

        <Button onClick={handleAddNewBillboard}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        data={billboardsItems}
        columns={billboardsColumns}
        searchKey='label'
      />
    </>
  )
}

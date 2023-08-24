'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Billboard } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

interface BillboardsClientProps {
  billboards: Billboard[]
}

export function BillboardsClient(props: BillboardsClientProps) {
  const { billboards } = props

  const router = useRouter()
  const params = useParams()

  function handleAddNewBillboard() {
    router.push(`/${params.storeId}/billboards/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${billboards.length})`}
          description='Manage billboards for your store'
        />

        <Button onClick={handleAddNewBillboard}>
          <PlusIcon className='mr-2 w-4 h-4' />
          Add New
        </Button>
      </div>

      <Separator />

      {billboards.map((billboard) => {
        return <div key={billboard.id}>{billboard.id}</div>
      })}
    </>
  )
}

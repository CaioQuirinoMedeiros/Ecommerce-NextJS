'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

import { OrderItem, ordersColumns } from './orders-columns'

interface OrdersClientProps {
  ordersItems: OrderItem[]
}

export function OrdersClient(props: OrdersClientProps) {
  const { ordersItems } = props

  return (
    <>
      <Heading
        title={`Orders (${ordersItems.length})`}
        description='Manage orders for your store'
      />

      <Separator />

      <DataTable
        data={ordersItems}
        columns={ordersColumns}
        searchKey='products'
      />
    </>
  )
}

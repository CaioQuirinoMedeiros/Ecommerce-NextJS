'use client'

import { ColumnDef } from '@tanstack/react-table'

export type OrderItem = {
  id: string
  phone: string
  address: string
  products: string[]
  totalPrice: string
  isPaid: boolean
  createdAt: string
}

export const ordersColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'products',
    header: 'Products'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total price'
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid'
  }
]

'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ProductCellAction } from './product-cell-action'

export type ProductItem = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const productsColumns: ColumnDef<ProductItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived'
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.color }}
        />
        {row.original.color}
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <span className='whitespace-nowrap'>{row.original.createdAt}</span>
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductCellAction data={row.original} />
  }
]

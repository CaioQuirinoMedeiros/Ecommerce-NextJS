'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CategoryCellAction } from './category-cell-action'

export type CategoryItem = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

export const categoriesColumns: ColumnDef<CategoryItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CategoryCellAction data={row.original} />
  }
]

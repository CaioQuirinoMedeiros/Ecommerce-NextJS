'use client'

import { ColumnDef } from '@tanstack/react-table'

import { SizeCellAction } from './size-cell-action'

export type SizeItem = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const sizesColumns: ColumnDef<SizeItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <SizeCellAction data={row.original} />
  }
]

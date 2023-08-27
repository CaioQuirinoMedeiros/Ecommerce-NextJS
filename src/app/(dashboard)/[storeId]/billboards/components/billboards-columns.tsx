'use client'

import { ColumnDef } from '@tanstack/react-table'

import { BillboardCellAction } from './billboard-cell-action'

export type BillboardItem = {
  id: string
  label: string
  createdAt: string
}

export const billboardsColumns: ColumnDef<BillboardItem>[] = [
  {
    accessorKey: 'label',
    header: 'Label'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <BillboardCellAction data={row.original} />
  }
]

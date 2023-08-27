'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ColorCellAction } from './color-cell-action'

export type ColorItem = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const colorsColumns: ColumnDef<ColorItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.value }}
        />
        {row.original.value}
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <ColorCellAction data={row.original} />
  }
]

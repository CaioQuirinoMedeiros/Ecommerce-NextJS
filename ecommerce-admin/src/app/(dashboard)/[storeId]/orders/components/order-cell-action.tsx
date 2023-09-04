'use client'

import * as React from 'react'
import { Copy, MoreHorizontal } from 'lucide-react'
import { toast } from 'react-hot-toast'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import { OrderItem } from './orders-columns'

interface OrderCellActionProps {
  data: OrderItem
}

export function OrderCellAction(props: OrderCellActionProps) {
  const { data } = props

  const orderId = data.id

  function handleCopyId() {
    navigator.clipboard.writeText(orderId)
    toast.success('Order ID copied to clipboard.')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className='mr-2 w-4 h-4' />
            Copy Id
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

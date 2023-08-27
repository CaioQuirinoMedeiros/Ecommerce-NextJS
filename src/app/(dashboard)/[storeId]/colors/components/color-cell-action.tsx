'use client'

import * as React from 'react'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { AlertModal } from '@/components/modals/alert-modal'

import { ColorItem } from './colors-columns'

interface ColorCellActionProps {
  data: ColorItem
}

export function ColorCellAction(props: ColorCellActionProps) {
  const { data } = props

  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId
  const colorId = data.id

  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  function handleCopyId() {
    navigator.clipboard.writeText(colorId)
    toast.success('Color ID copied to clipboard.')
  }

  function handleUpdate() {
    router.push(`/${storeId}/colors/${colorId}`)
  }

  async function deleteColor() {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/${storeId}/colors/${colorId}`)
      router.refresh()
      toast.success('Color deleted')
    } catch (error: any) {
      toast.error(handleAxiosError(error).message)
    } finally {
      setIsAlertOpen(false)
    }
  }

  function handleDelete() {
    setIsAlertOpen(true)
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
          <DropdownMenuItem onClick={handleUpdate}>
            <Edit className='mr-2 w-4 h-4' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className='mr-2 w-4 h-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertModal
        isLoading={isDeleting}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={deleteColor}
      />
    </>
  )
}

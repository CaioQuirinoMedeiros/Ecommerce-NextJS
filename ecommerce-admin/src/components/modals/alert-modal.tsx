'use client'

import * as React from 'react'

import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface AlertModalProps {
  isOpen: boolean
  onClose(): void
  onConfirm(): void
  isLoading: boolean
}

export function AlertModal(props: AlertModalProps) {
  const { isLoading, isOpen, onClose, onConfirm } = props

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button variant='outline' disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant='destructive' disabled={isLoading} onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  )
}

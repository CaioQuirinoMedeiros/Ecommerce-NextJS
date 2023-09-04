'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface ModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose(): void
  children?: React.ReactNode
}

export function Modal(props: ModalProps) {
  const { description, isOpen, onClose, title, children } = props

  function onChange(open: boolean) {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

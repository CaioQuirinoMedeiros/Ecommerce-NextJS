'use client'

import * as React from 'react'

import { useStoreModalStore } from '@/hooks/use-store-modal-store'

export function RootPageClient() {
  const onOpen = useStoreModalStore((state) => state.onOpen)
  const isOpen = useStoreModalStore((state) => state.isOpen)

  React.useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null
}

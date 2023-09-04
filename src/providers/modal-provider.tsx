"use client"

import { PreviewModal } from '@/components/preview-modal'
import * as React from 'react'

export function ModalProvider() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <PreviewModal />
}

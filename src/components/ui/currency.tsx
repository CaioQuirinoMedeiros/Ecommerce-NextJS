'use client'

import * as React from "react"
import { formatCurrency } from '@/utils/formatCurrency'

interface CurrencyProps {
  value: number | string
}

export function Currency(props: CurrencyProps) {
  const { value } = props

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <div className='font-semibold'>{formatCurrency(Number(value))}</div>
}

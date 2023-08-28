'use client'

import { formatCurrency } from '@/utils/formatCurrency'

interface CurrencyProps {
  value: number | string
}

export function Currency(props: CurrencyProps) {
  const { value } = props

  return <div className='font-semibold'>{formatCurrency(Number(value))}</div>
}

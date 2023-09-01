'use client'

import * as React from 'react'
import axios from 'axios'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'react-hot-toast'
import { Currency } from '@/components/ui/currency'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

export function Summary() {
  const searchParams = useSearchParams()
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)

  React.useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.')
      removeAll()
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.')
    }
  }, [searchParams, removeAll])

  const totalPrice = items.reduce((acc, item) => {
    return acc + Number(item.price)
  }, 0)

  async function handleCheckout() {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id)
      }
    )

    window.location = response.data.sessionUrl
  }

  return (
    <div className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
      <h2 className='text-lg font-medium text-gray-900'>Order Summary</h2>
      <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
          <div className='text-base font-medium text-gray-9000'>
            Order total
          </div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <Button
        disabled={!items.length}
        className='w-full mt-6'
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </div>
  )
}

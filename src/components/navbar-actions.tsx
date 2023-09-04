'use client'

import * as React from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'

export function NavbarActions() {
  const cart = useCart()
  const router = useRouter()

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  function handleGoToCart() {
    router.push("/cart")
  }

  if (!isMounted) return null

  return (
    <div className='ml-auto flex items-center gap-x-4'>
      <Button onClick={handleGoToCart} className='flex items-center rounded-full bg-black px-4 py-2'>
        <ShoppingBag size={20} color='white' />
        <span className='ml-2 text-sm font-medium text-white'>
          {cart.items.length}
        </span>
      </Button>
    </div>
  )
}

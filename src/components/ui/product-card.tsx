'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { Expand, ShoppingCart } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { Currency } from './currency'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export function ProductCard(props: ProductCardProps) {
  const { product } = props

  const router = useRouter()

  function handleSelectProduct() {
    router.push(`/products/${product.id}`)
  }

  return (
    <div
      className='bg-white group cursor-pointer rounded-xl border p-3 space-y-4'
      onClick={handleSelectProduct}
    >
      <div className='aspect-square rounded-xl bg-gray-100 relative'>
        <Image
          src={product.images[0]?.url}
          alt={product.name}
          fill
          className='aspect-square object-cover rounded-md'
        />
        <div className='opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5'>
          <div className='flex gap-x-6 justify-center'>
            <IconButton icon={<Expand size={20} className='text-gray-600' />} />
            <IconButton
              icon={<ShoppingCart size={20} className='text-gray-600' />}
            />
          </div>
        </div>
      </div>

      <div>
        <p className='font-semibold text-lg'>{product.name}</p>
        <p className='text-sm text-gray-500'>{product.category.name}</p>
      </div>

      <div className='flex items-center justify-between'>
        <Currency value={product.price} />
      </div>
    </div>
  )
}

import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'
import { formatCurrency } from '@/utils/formatCurrency'

import { ProductsClient } from './components/products-client'
import { ProductItem } from './components/products-columns'

interface ProductsPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function ProductsPage(props: ProductsPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      size: true,
      color: true
    }
  })

  const productsItems: ProductItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatCurrency(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductsClient productsItems={productsItems} />
      </div>
    </div>
  )
}

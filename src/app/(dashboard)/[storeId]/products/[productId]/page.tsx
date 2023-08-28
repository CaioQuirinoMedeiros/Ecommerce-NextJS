import { prismadb } from '@/lib/prismadb'

import { ProductForm } from './components/product-form'

interface ProductPageProps {
  params: { storeId: string; productId: string }
  searchParams?: Record<string, string>
}

export default async function ProductPage(props: ProductPageProps) {
  const { params } = props

  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true }
  })

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId }
  })

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId }
  })

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId }
  })

  console.log({
    price: product?.price,
    typeof: typeof product?.price,
    typeofF: typeof product?.price?.toNumber
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 py-6'>
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}

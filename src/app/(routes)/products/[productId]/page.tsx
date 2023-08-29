import { getProduct } from '@/actios/get-product'
import { getProducts } from '@/actios/get-products'
import { Gallery } from '@/components/gallery'
import { Info } from '@/components/info'
import { ProductsList } from '@/components/products-list'
import { Container } from '@/components/ui/container'

interface ProductPageProps {
  params: { productId: string }
  searchParams?: Record<string, string>
}

export default async function ProductPage(props: ProductPageProps) {
  console.log(props.params)
  const { params } = props

  const product = await getProduct(params.productId)

  const suggestedProducts = await getProducts({
    categoryId: product.category.id
  })

  return (
    <div className='bg-white'>
      <Container>
        <div className='px-4 py-10 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'>
            <Gallery images={product.images} />
            <div className='mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0'>
              <Info product={product} />
            </div>
          </div>

          <hr className='my-10' />

          <ProductsList title='Related Items' products={suggestedProducts} />
        </div>
      </Container>
    </div>
  )
}

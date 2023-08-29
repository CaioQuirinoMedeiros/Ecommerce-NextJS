import { getCategory } from '@/actios/get-category'
import { getProducts } from '@/actios/get-products'
import { getColors } from '@/actios/getColors'
import { getSizes } from '@/actios/getSizes'
import { Billboard } from '@/components/billboard'
import { Gallery } from '@/components/gallery'
import { Info } from '@/components/info'
import { ProductsList } from '@/components/products-list'
import { Container } from '@/components/ui/container'
import { Filter } from './components/filter'
import { NoResults } from '@/components/ui/no-results'
import { ProductCard } from '@/components/ui/product-card'
import { MobileFilters } from './components/mobile-filters'

interface CategoryPageProps {
  params: { categoryId: string }
  searchParams?: {
    colorId?: string
    sizeId?: string
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { params, searchParams } = props

  const products = await getProducts({
    categoryId: params.categoryId,
    sizeId: searchParams?.sizeId,
    colorId: searchParams?.colorId
  })

  const sizes = await getSizes()
  const colors = await getColors()
  const category = await getCategory(params.categoryId)

  return (
    <div className='bg-white'>
      <Container>
        <Billboard data={category.billboard} />

        <div className='px-4 sm:px-6 lg:px-8 pb-24'>
          <div className='lg:grid lg:grid-cols-5 lg:gap-x-8'>
            <MobileFilters sizes={sizes} colors={colors} />
            <div className='hidden lg:block'>
              <Filter valueKey='sizeId' name='Sizes' data={sizes} />
              <Filter valueKey='colorId' name='Colors' data={colors} />
            </div>

            <div className='mt-6 lg:col-span-4 lg:mt-0'>
              {products.length ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {products.map((product) => {
                    return <ProductCard key={product.id} product={product} />
                  })}
                </div>
              ) : (
                <NoResults />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

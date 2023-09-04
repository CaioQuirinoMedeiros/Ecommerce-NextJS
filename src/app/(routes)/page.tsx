import { getBillboard } from '@/actios/get-billboard'
import { getProducts } from '@/actios/get-products'
import { Billboard } from '@/components/billboard'
import { ProductsList } from '@/components/products-list'
import { Container } from '@/components/ui/container'

export default async function Home() {
  const billboard = await getBillboard('a4f1e4fd-8059-4054-8668-b14311daef81')

  const products = await getProducts({ isFeatured: true })

  return (
    <Container>
      <div className='space-y-10 pb-10'>
        <Billboard data={billboard} />
        <div className='flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8'>
          <ProductsList title='Featured Products' products={products} />
        </div>
      </div>
    </Container>
  )
}

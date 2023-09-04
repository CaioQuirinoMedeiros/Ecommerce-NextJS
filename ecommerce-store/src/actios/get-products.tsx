import { Product } from '@/types'
import qs from 'query-string'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface GetProductsParams {
  categoryId?: string
  colorId?: string
  sizeId?: string
  isFeatured?: boolean
}

export async function getProducts(
  params: GetProductsParams
): Promise<Product[]> {
  const { categoryId, colorId, isFeatured, sizeId } = params

  const fullUrl = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: colorId,
      sizeId: sizeId,
      categoryId: categoryId,
      isFeatured: isFeatured
    }
  })

  const response = await fetch(fullUrl)

  const { products } = await response.json()

  return products
}

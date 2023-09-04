import { Product } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

export async function getProduct(productId: string): Promise<Product> {
  const response = await fetch(`${URL}/${productId}`)

  const { product } = await response.json()

  return product
}

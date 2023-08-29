import { Color } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`

export async function getColors(): Promise<Color[]> {
  const response = await fetch(URL)

  const { colors } = await response.json()

  return colors
}

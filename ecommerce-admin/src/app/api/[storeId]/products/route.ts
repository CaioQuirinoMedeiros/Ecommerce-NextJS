import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

interface ProductsRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const createProductBodySchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  images: z.object({ url: z.string().url() }).array().min(1)
})

export async function POST(
  request: NextRequest,
  { params }: ProductsRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: {
        id: params.storeId,
        userId: userId
      }
    })

    const body = await request.json()

    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchived,
      isFeatured
    } = createProductBodySchema.parse(body)

    const product = await prismadb.product.create({
      data: {
        name: name,
        images: { createMany: { data: images } },
        price: price,
        isFeatured: isFeatured,
        isArchived: isArchived,
        categoryId: categoryId,
        sizeId: sizeId,
        colorId: colorId,
        storeId: params.storeId
      }
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: ProductsRouteProps
) {
  try {
    const categoryId =
      request.nextUrl.searchParams.get('categoryId') || undefined
    const colorId = request.nextUrl.searchParams.get('colorId') || undefined
    const sizeId = request.nextUrl.searchParams.get('sizeId') || undefined
    const isFeatured = request.nextUrl.searchParams.get('isFeatured')

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

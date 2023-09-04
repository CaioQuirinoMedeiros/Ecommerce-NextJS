import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface ProductRouteProps {
  params: {
    storeId: string
    productId: string
  }
  searchParams?: Record<string, string>
}

const updateProductBodySchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  images: z.object({ url: z.string().url() }).array().min(1)
})

export async function GET(
  _request: NextRequest,
  { params }: ProductRouteProps
) {
  try {
    const product = await prismadb.product.findUniqueOrThrow({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true
      }
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: ProductRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
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
    } = updateProductBodySchema.parse(body)

    let product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name: name,
        images: { deleteMany: {} },
        price: price,
        isFeatured: isFeatured,
        isArchived: isArchived,
        categoryId: categoryId,
        sizeId: sizeId,
        colorId: colorId
      }
    })

    product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: { createMany: { data: images } }
      }
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: ProductRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const product = await prismadb.product.delete({
      where: { id: params.productId }
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

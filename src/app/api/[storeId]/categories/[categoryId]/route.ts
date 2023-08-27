import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface CategoryRouteProps {
  params: {
    storeId: string
    categoryId: string
  }
  searchParams?: Record<string, string>
}

const updateCategoryBodySchema = z.object({
  name: z.string(),
  billboardId: z.string()
})

export async function GET(
  _request: NextRequest,
  { params }: CategoryRouteProps
) {
  try {
    const category = await prismadb.category.findUniqueOrThrow({
      where: { id: params.categoryId }
    })

    return NextResponse.json({ category })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: CategoryRouteProps
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

    const { name, billboardId } = updateCategoryBodySchema.parse(body)

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId
      },
      data: {
        name: name,
        billboardId: billboardId
      }
    })

    return NextResponse.json({ category })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: CategoryRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const category = await prismadb.category.delete({
      where: { id: params.categoryId }
    })

    return NextResponse.json({ category })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

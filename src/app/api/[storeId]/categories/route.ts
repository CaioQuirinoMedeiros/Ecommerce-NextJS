import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

interface CategoriesRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const createCategoryBodySchema = z.object({
  name: z.string(),
  billboardId: z.string()
})

export async function POST(
  request: NextRequest,
  { params }: CategoriesRouteProps
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

    const { name, billboardId } = createCategoryBodySchema.parse(body)

    const category = await prismadb.category.create({
      data: {
        name: name,
        billboardId: billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function GET(
  _request: NextRequest,
  { params }: CategoriesRouteProps
) {
  try {
    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId }
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

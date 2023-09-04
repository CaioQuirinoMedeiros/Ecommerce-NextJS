import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

interface BillboardsRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const createBillboardBodySchema = z.object({
  label: z.string(),
  imageUrl: z.string().url()
})

export async function POST(
  request: NextRequest,
  { params }: BillboardsRouteProps
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

    const { label, imageUrl } = createBillboardBodySchema.parse(body)

    const billboard = await prismadb.billboard.create({
      data: {
        label: label,
        imageUrl: imageUrl,
        storeId: params.storeId
      }
    })

    return NextResponse.json({ billboard }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function GET(
  _request: NextRequest,
  { params }: BillboardsRouteProps
) {
  try {
    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId }
    })

    return NextResponse.json({ billboards })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

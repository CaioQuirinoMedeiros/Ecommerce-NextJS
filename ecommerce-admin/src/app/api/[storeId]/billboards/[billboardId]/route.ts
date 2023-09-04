import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface BillboardRouteProps {
  params: {
    storeId: string
    billboardId: string
  }
  searchParams?: Record<string, string>
}

const updateBillboardBodySchema = z.object({
  label: z.string(),
  imageUrl: z.string().url()
})

export async function GET(
  _request: NextRequest,
  { params }: BillboardRouteProps
) {
  try {
    const billboard = await prismadb.billboard.findUniqueOrThrow({
      where: { id: params.billboardId }
    })

    return NextResponse.json({ billboard })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: BillboardRouteProps
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

    const { imageUrl, label } = updateBillboardBodySchema.parse(body)

    const billboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId
      },
      data: {
        label: label,
        imageUrl: imageUrl
      }
    })

    return NextResponse.json({ billboard })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: BillboardRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const billboard = await prismadb.billboard.delete({
      where: { id: params.billboardId }
    })

    return NextResponse.json({ billboard })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

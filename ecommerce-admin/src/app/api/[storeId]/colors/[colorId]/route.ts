import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface ColorRouteProps {
  params: {
    storeId: string
    colorId: string
  }
  searchParams?: Record<string, string>
}

const updateColorBodySchema = z.object({
  name: z.string(),
  value: z.string()
})

export async function GET(
  _request: NextRequest,
  { params }: ColorRouteProps
) {
  try {
    const color = await prismadb.color.findUniqueOrThrow({
      where: { id: params.colorId }
    })

    return NextResponse.json({ color })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: ColorRouteProps
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

    const { name, value } = updateColorBodySchema.parse(body)

    const color = await prismadb.color.update({
      where: {
        id: params.colorId
      },
      data: {
        name: name,
        value: value
      }
    })

    return NextResponse.json({ color })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: ColorRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const color = await prismadb.color.delete({
      where: { id: params.colorId }
    })

    return NextResponse.json({ color })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

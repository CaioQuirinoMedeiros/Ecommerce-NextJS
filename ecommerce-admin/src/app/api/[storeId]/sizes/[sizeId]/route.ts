import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface SizeRouteProps {
  params: {
    storeId: string
    sizeId: string
  }
  searchParams?: Record<string, string>
}

const updateSizeBodySchema = z.object({
  name: z.string(),
  value: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: 'Color value must be a valid hex code'
  })
})

export async function GET(_request: NextRequest, { params }: SizeRouteProps) {
  try {
    const size = await prismadb.size.findUniqueOrThrow({
      where: { id: params.sizeId }
    })

    return NextResponse.json({ size })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest, { params }: SizeRouteProps) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const body = await request.json()

    const { name, value } = updateSizeBodySchema.parse(body)

    const size = await prismadb.size.update({
      where: {
        id: params.sizeId
      },
      data: {
        name: name,
        value: value
      }
    })

    return NextResponse.json({ size })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: SizeRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    await prismadb.store.findFirstOrThrow({
      where: { id: params.storeId, userId: userId }
    })

    const size = await prismadb.size.delete({
      where: { id: params.sizeId }
    })

    return NextResponse.json({ size })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

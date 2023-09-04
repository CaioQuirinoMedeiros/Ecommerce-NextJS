import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

interface SizesRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const createSizeBodySchema = z.object({
  name: z.string(),
  value: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: 'Color value must be a valid hex code'
  })
})

export async function POST(request: NextRequest, { params }: SizesRouteProps) {
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

    const { name, value } = createSizeBodySchema.parse(body)

    const size = await prismadb.size.create({
      data: {
        name: name,
        value: value,
        storeId: params.storeId
      }
    })

    return NextResponse.json({ size }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function GET(_request: NextRequest, { params }: SizesRouteProps) {
  try {
    const sizes = await prismadb.size.findMany({
      where: { storeId: params.storeId }
    })

    return NextResponse.json({ sizes })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

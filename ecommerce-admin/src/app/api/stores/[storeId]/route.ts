import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { handleRouteError } from '@/utils/handleRouteError'

interface StoreRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const updateStoreBodySchema = z.object({
  name: z.string().min(1)
})

export async function PATCH(request: NextRequest, { params }: StoreRouteProps) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    const body = await request.json()

    const { name } = updateStoreBodySchema.parse(body)

    const store = await prismadb.store.update({
      where: { id: params.storeId, userId: userId },
      data: { name: name }
    })

    return NextResponse.json({ store })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: StoreRouteProps
) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    const store = await prismadb.store.delete({
      where: { id: params.storeId, userId: userId }
    })

    return NextResponse.json({ store })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

interface ColorsRouteProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

const createColorBodySchema = z.object({
  name: z.string(),
  value: z.string()
})

export async function POST(
  request: NextRequest,
  { params }: ColorsRouteProps
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

    const { name, value } = createColorBodySchema.parse(body)

    const color = await prismadb.color.create({
      data: {
        name: name,
        value: value,
        storeId: params.storeId
      }
    })

    return NextResponse.json({ color }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

export async function GET(
  _request: NextRequest,
  { params }: ColorsRouteProps
) {
  try {
    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId }
    })

    return NextResponse.json({ colors })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

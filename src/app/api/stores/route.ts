import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/errors/app-error'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

const createStoreBodySchema = z.object({
  name: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      throw new AppError({ statusCode: 401, message: 'Not authenticated' })
    }

    const body = await request.json()

    const { name } = createStoreBodySchema.parse(body)

    const store = await prismadb.store.create({
      data: {
        userId: userId,
        name: name
      }
    })

    return NextResponse.json({ store }, { status: 201 })
  } catch (error: any) {
    return handleRouteError(error)
  }
}

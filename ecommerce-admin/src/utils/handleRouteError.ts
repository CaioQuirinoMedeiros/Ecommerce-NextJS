import { NextResponse } from 'next/server'

import { AppError } from '@/errors/app-error'

export function handleRouteError(error: Error) {
  console.log(error)
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    )
  } else {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

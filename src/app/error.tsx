'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { AppError } from '@/errors/app-error'

interface RootErrorProps {
  error: Error
  reset(): void
}

export default function RootError(props: RootErrorProps) {
  const { error, reset } = props

  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const message =
    error instanceof AppError ? error.message : 'Something went wrong'

  return (
    <div className='flex items-center h-full justify-center flex-col gap-4'>
      <h2>{message}</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

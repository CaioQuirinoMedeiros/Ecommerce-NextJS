'use client'

import { cn } from '@/utils/styles'
import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button_(props, ref) {
    const { className, children, disabled, type = 'button', ...rest } = props

    return (
      <button
        ref={ref}
        className={cn(
          'w-auto rounded-full bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition',
          className
        )}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

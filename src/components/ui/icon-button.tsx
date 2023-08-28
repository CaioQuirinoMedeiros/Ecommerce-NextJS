'use client'

import { cn } from '@/utils/styles'

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement
}

export function IconButton(props: IconButtonProps) {
  const { icon, className, ...rest } = props

  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition',
        className
      )}
      {...rest}
    >
      {icon}
    </button>
  )
}

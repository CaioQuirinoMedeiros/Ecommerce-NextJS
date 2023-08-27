'use client'

import { Copy, ServerIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge, BadgeProps } from '@/components/ui/badge'

import { Button } from './button'

type Variant = 'public' | 'admin'

interface ApiAlertProps {
  title: string
  description: string
  variant: Variant
}

const variantTextMap: Record<Variant, string> = {
  admin: 'Admin',
  public: 'Public'
}

const variantVariantMap: Record<Variant, BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
}

export function ApiAlert(props: ApiAlertProps) {
  const { description, title, variant } = props

  function onCopy() {
    navigator.clipboard.writeText(description)
    toast.success('API Route copied to the clipboard')
  }

  return (
    <Alert>
      <ServerIcon className='h-4 w-4' />
      <AlertTitle className='flex items-center gap-2'>
        {title}
        <Badge variant={variantVariantMap[variant]}>
          {variantTextMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className='mt-4 flex items-center justify-between gap-4'>
        <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
          {description}
        </code>

        <Button variant='outline' size='icon' onClick={onCopy}>
          <Copy className='h-4 w-4' />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

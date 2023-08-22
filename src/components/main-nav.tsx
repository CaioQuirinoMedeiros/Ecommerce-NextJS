'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/utils/styles'

type Route = {
  href: string
  label: string
  isActive: boolean
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav(props: MainNavProps) {
  const { className, ...rest } = props

  const pathname = usePathname()
  const params = useParams()

  const settingsHref = `/${params.storeId}/settings`

  const routes: Route[] = [
    {
      href: settingsHref,
      label: 'Settings',
      isActive: pathname === settingsHref
    }
  ]

  return (
    <nav
      {...rest}
      className={cn('flex items-center space-4 lg:space-6', className)}
    >
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary  active:text-black dark:active:text-white',
              route.isActive
                ? 'text-back dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

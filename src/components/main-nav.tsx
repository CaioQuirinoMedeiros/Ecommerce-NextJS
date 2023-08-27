'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/utils/styles'

type Route = {
  href: string
  label: string
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav(props: MainNavProps) {
  const { className, ...rest } = props

  const pathname = usePathname()
  const params = useParams()

  const routes: Route[] = [
    {
      href: `/${params.storeId}`,
      label: 'Overview'
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards'
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories'
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes'
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors'
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings'
    }
  ]

  return (
    <nav
      {...rest}
      className={cn('flex items-center gap-4 lg:gap-6', className)}
    >
      {routes.map((route) => {
        const isActive = route.href === pathname
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary  active:text-black dark:active:text-white',
              isActive ? 'text-back dark:text-white' : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

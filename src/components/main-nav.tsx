'use client'

import { cn } from '@/utils/styles'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Category } from '@/types'

interface MainNavProps {
  data: Category[]
}

export function MainNav(props: MainNavProps) {
  const { data } = props

  const pathname = usePathname()

  const routes = data.map((route) => {
    return {
      href: `/categories/${route.id}`,
      label: route.name
    }
  })

  return (
    <nav className='mx-6 flex items-center space-x-4 lg:space-x-6'>
      {routes.map((route) => {
        const isActive = route.href === pathname

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-black',
              isActive ? 'text-black' : 'text-neutral-500'
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/main-nav'
import { StoreSwitcher } from '@/components/store-switcher'
import { prismadb } from '@/lib/prismadb'

export async function Navbar() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prismadb.store.findMany({ where: { userId: userId } })

  return (
    <nav className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher stores={stores} />

        <MainNav className='mx-6' />

        <div className='ml-auto flex items-center gap-4'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </nav>
  )
}
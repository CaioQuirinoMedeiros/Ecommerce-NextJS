import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout(props: MainLayoutProps) {
  const { children } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: { userId: userId }
  })

  if (store) {
    redirect(`/${store.id}`)
  }

  return <>{children}</>
}

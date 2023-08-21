import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { storeId: string }
  searchParams?: {}
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { params, children } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId
    }
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div>
      <span>Navbar for {store.id}</span>
      {children}
    </div>
  )
}

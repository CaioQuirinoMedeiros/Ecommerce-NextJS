import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

import { BillboardsClient } from './components/billboards-client'

interface BillboardsPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function BillboardsPage(props: BillboardsPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient billboards={billboards} />
      </div>
    </div>
  )
}

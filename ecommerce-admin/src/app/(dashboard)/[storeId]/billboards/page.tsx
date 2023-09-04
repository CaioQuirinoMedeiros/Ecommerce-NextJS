import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { BillboardsClient } from './components/billboards-client'
import { BillboardItem } from './components/billboards-columns'

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
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' }
  })

  const billboardsItems: BillboardItem[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient billboardsItems={billboardsItems} />
      </div>
    </div>
  )
}

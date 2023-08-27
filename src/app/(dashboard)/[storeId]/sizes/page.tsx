import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { SizesClient } from './components/sizes-client'
import { SizeItem } from './components/sizes-columns'

interface SizesPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function SizesPage(props: SizesPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  })

  const sizesItems: SizeItem[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient sizesItems={sizesItems} />
      </div>
    </div>
  )
}

import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { ColorsClient } from './components/colors-client'
import { ColorItem } from './components/colors-columns'

interface ColorsPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function ColorsPage(props: ColorsPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  })

  const colorsItems: ColorItem[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorsClient colorsItems={colorsItems} />
      </div>
    </div>
  )
}

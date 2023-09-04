import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'

import { CategoriesClient } from './components/categories-client'
import { CategoryItem } from './components/categories-columns'

interface CategoriesPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
    include: { billboard: true }
  })

  const categoriesItems: CategoryItem[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient categoriesItems={categoriesItems} />
      </div>
    </div>
  )
}

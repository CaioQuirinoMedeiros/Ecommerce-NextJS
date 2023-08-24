import { prismadb } from '@/lib/prismadb'

import { BillboardForm } from './components/billboard-form'

interface BillboardPageProps {
  params: { storeId: string; billboardId: string }
  searchParams?: Record<string, string>
}

export default async function BillboardPage(props: BillboardPageProps) {
  const { params } = props

  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 py-6'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}

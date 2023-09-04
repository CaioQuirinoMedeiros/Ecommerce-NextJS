import { prismadb } from '@/lib/prismadb'

import { SizeForm } from './components/size-form'

interface SizePageProps {
  params: { storeId: string; sizeId: string }
  searchParams?: Record<string, string>
}

export default async function SizePage(props: SizePageProps) {
  const { params } = props

  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 py-6'>
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}

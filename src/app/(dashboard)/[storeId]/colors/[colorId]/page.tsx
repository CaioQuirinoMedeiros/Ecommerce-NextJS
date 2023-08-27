import { prismadb } from '@/lib/prismadb'

import { ColorForm } from './components/color-form'

interface ColorPageProps {
  params: { storeId: string; colorId: string }
  searchParams?: Record<string, string>
}

export default async function ColorPage(props: ColorPageProps) {
  const { params } = props

  const color = await prismadb.color.findUnique({
    where: { id: params.colorId }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 py-6'>
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}

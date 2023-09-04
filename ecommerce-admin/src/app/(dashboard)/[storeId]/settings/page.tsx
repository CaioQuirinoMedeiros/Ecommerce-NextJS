import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prismadb } from '@/lib/prismadb'

import { SettingsForm } from './components/settings-form'

interface SettingsPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function SettingsPage(props: SettingsPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findFirstOrThrow({
    where: {
      id: params.storeId,
      userId: userId
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

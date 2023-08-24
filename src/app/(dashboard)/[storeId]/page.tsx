import { prismadb } from '@/lib/prismadb'

interface DashboardPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const { params } = props

  const store = await prismadb.store.findFirstOrThrow({
    where: { id: params.storeId }
  })

  return <h1>Dashboard Page: {store.name}</h1>
}

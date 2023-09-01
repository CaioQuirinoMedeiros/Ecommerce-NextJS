import { CreditCard, DollarSign, PackageIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatCurrency'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getStockCount } from '@/actions/get-stock-count'
import { Overview } from '@/components/overview'
import { getGraphRevenue } from '@/actions/get-graph-revenue'

interface DashboardPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const { params } = props

  const storeId = params.storeId

  const totalRevenue = await getTotalRevenue(storeId)
  const salesCount = await getSalesCount(storeId)
  const stockCount = await getStockCount(storeId)
  const graphRevenue = await getGraphRevenue(storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Dashboard' description='Overview of your store' />
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSign className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Products In Stock
              </CardTitle>
              <PackageIcon className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <Overview data={graphRevenue } />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

import { prismadb } from '@/lib/prismadb'
import { formatCurrency } from '@/utils/formatCurrency'

import { OrdersClient } from './components/orders-client'
import { OrderItem } from './components/orders-columns'

interface OrdersPageProps {
  params: { storeId: string }
  searchParams?: Record<string, string>
}

export default async function OrdersPage(props: OrdersPageProps) {
  const { params } = props

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prismadb.store.findUniqueOrThrow({
    where: { userId: userId, id: params.storeId }
  })

  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  const ordersItems: OrderItem[] = orders.map((order) => {
    const totalPrice = order.orderItems.reduce((acc, orderItem) => {
      return acc + orderItem.product.price.toNumber()
    }, 0)

    return {
      id: order.id,
      phone: order.phone,
      address: order.address,
      products: order.orderItems.map((orderItem) => orderItem.product.name),
      totalPrice: formatCurrency(totalPrice),
      isPaid: order.isPaid,
      createdAt: format(order.createdAt, 'MMMM do, yyyy')
    }
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrdersClient ordersItems={ordersItems} />
      </div>
    </div>
  )
}

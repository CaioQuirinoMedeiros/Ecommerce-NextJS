import { prismadb } from '@/lib/prismadb'

export async function getTotalRevenue(storeId: string) {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  const totalPrice = paidOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((itemsAcc, orderItem) => {
      return itemsAcc + orderItem.product.price.toNumber()
    }, 0)

    return acc + orderTotal
  }, 0)

  return totalPrice
}

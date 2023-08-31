import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { handleRouteError } from '@/utils/handleRouteError'
import { prismadb } from '@/lib/prismadb'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return handleRouteError(error)
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session?.customer_details?.address
  const phone = session?.customer_details?.phone
  const orderId = session.metadata?.orderId

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ]

  const addressString = addressComponents.filter((item) => !!item).join(', ')

  if (event.type === 'checkout.session.completed') {
    const order = await prismadb.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        address: addressString,
        phone: phone ?? ''
      },
      include: { orderItems: true }
    })

    const productIds = order.orderItems.map((orderItem) => {
      return orderItem.productId
    })

    await prismadb.product.updateMany({
      where: {
        id: { in: [...productIds] }
      },
      data: { isArchived: true }
    })
  }

  return new NextResponse(undefined, { status: 200 })
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'

import { AppError } from '@/errors/app-error'
import { prismadb } from '@/lib/prismadb'
import { stripe } from '@/lib/stripe'
import { handleRouteError } from '@/utils/handleRouteError'

interface CategoryRouteProps {
  params: {
    storeId: string
  }
  searchParams?: Record<string, string>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

const checkoutBodySchema = z.object({
  productIds: z.string().array()
})

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  request: NextRequest,
  { params }: CategoryRouteProps
) {
  try {
    const body = await request.json()

    const { productIds } = checkoutBodySchema.parse(body)

    if (!productIds.length) {
      throw new AppError({ message: 'No product on order.' })
    }

    const products = await prismadb.product.findMany({
      where: {
        id: { in: productIds }
      }
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.map((product) => {
        return {
          quantity: 1,
          price_data: {
            currency: 'USD',
            product_data: { name: product.name },
            unit_amount: product.price.toNumber() * 100
          }
        }
      })

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } }
          }))
        }
      }
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
      metadata: {
        orderId: order.id
      }
    })

    return NextResponse.json(
      { sessionUrl: session.url },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return handleRouteError(error)
  }
}

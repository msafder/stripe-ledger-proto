import { Controller, Get, Post, Query } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/stripe.provider';

@Controller('checkout')
export class CheckoutController {
  private readonly webUrl: string;
  private readonly priceId: string;

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe
  ) {
    this.webUrl = process.env.WEB_URL ?? 'http://localhost:3001';
    this.priceId = process.env.STRIPE_PRICE_ID ?? '';
  }  

//   constructor(
//     @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
//     private readonly prisma: PrismaService,
//   ) {
//     this.webUrl = process.env.WEB_URL ?? 'http://localhost:3001';
//     this.priceId = process.env.STRIPE_PRICE_ID ?? '';
//   }

  @Post('create')
  async create() {
    if (!this.priceId) {
      return { error: 'Missing STRIPE_PRICE_ID in env' };
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: this.priceId, quantity: 1 }],
      success_url: `${this.webUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.webUrl}/pricing`,
    });

    return { url: session.url };
  }

  @Get('status')
  async status(@Query('session_id') sessionId?: string) {
    if (!sessionId) return { error: 'Missing session_id' };

    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;

    // const ledgerCount = await this.prisma.ledgerEntry.count({
    //   where: { referenceId: sessionId },
    // });


    return {
      stripe: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email ?? null,
        payment_intent_id: paymentIntent?.id ?? null,
      }      
    };
  }

//     return {
//       stripe: {
//         id: session.id,
//         status: session.status,
//         payment_status: session.payment_status,
//         amount_total: session.amount_total,
//         currency: session.currency,
//         customer_email: session.customer_details?.email ?? null,
//         payment_intent_id: paymentIntent?.id ?? null,
//       },
//       db: {
//         processed: ledgerCount > 0,
//         ledger_entries: ledgerCount,
//       },
//     };
//   }
}
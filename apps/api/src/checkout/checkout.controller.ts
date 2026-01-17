import { Body, Controller, Inject, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/stripe.provider';

@Controller('checkout')
export class CheckoutController {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  @Post('session')
  async createSession(@Body() body: { priceId: string; customerId?: string }) {
    if (!body?.priceId) {
      return { error: 'Missing priceId' };
    }

    // For a prototype this is OK; in production, prefer a deterministic key per "order draft"
    const idemKey = `checkout_session:${body.customerId ?? 'guest'}:${body.priceId}:${Date.now()}`;

    const session = await this.stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [{ price: body.priceId, quantity: 1 }],
        success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.WEB_URL}/cancel`,
        client_reference_id: body.customerId ?? undefined,
        metadata: {
          prototype: 'stripe-ledger-proto'
        }
      },
      { idempotencyKey: idemKey }
    );

    return { url: session.url };
  }
}

import { Controller, Headers, Inject, Post, Req, Res } from '@nestjs/common';
import Stripe from 'stripe';
// import { STRIPE_CLIENT } from '../stripe/stripe.provider';
// import { LedgerService } from '../ledger/ledger.service';

@Controller('webhooks')
export class StripeWebhookController {
//   constructor(
//     @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
//     private readonly ledger: LedgerService
//   ) {}

  @Post('stripe')
  async handle(@Req() req: any, @Res() res: any, @Headers('stripe-signature') sig?: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
    }
    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    const rawBody: Buffer = req.body;

    let event: Stripe.Event;
    // try {
    //   event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    // } catch (err: any) {
    //   return res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    // await this.ledger.processStripeEvent(event);

    return res.json({ received: true });
  }
}
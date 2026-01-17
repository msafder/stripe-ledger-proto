import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async processStripeEvent(event: Stripe.Event) {
    await this.prisma.$transaction(async (tx) => {
      // Idempotency: only process each Stripe event once
      const existing = await tx.stripeEvent.findUnique({ where: { eventId: event.id } });
      if (existing?.processedAt) return;

      if (!existing) {
        await tx.stripeEvent.create({
          data: {
            eventId: event.id,
            type: event.type,
            payload: event as any
          }
        });
      }

      // Translate event -> ledger entries
      // Prototype: recognize revenue on checkout.session.completed
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const amount = BigInt(session.amount_total ?? 0);
        const currency = session.currency ?? 'usd';

        // Example ledger:
        // STRIPE_CLEARING +amount
        // REVENUE        -amount
        await tx.ledgerEntry.createMany({
          data: [
            {
              referenceType: 'stripe_event',
              referenceId: event.id,
              accountCode: 'STRIPE_CLEARING',
              amountCents: amount,
              currency,
              description: `Checkout completed: ${session.id}`
            },
            {
              referenceType: 'stripe_event',
              referenceId: event.id,
              accountCode: 'REVENUE',
              amountCents: -amount,
              currency,
              description: `Recognize revenue: ${session.id}`
            }
          ]
        });
      }

      await tx.stripeEvent.update({
        where: { eventId: event.id },
        data: { processedAt: new Date() }
      });
    });
  }
}

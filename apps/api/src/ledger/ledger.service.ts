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
            payload: event as any,
          },
        });
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const amount = BigInt(session.amount_total ?? 0);
        const currency = session.currency ?? 'usd';

        const entries = [
          {
            referenceType: 'stripe_checkout_session',
            referenceId: session.id,
            accountCode: 'STRIPE_CLEARING',
            amountCents: amount,
            currency,
            description: `Checkout completed: ${session.id} (event ${event.id})`,
          },
          {
            referenceType: 'stripe_checkout_session',
            referenceId: session.id,
            accountCode: 'REVENUE',
            amountCents: -amount,
            currency,
            description: `Recognize revenue (event ${event.id})`,
          },
        ] as const;

        // Ensure referenced accounts exist (prevents FK violations)
        const codes = Array.from(new Set(entries.map((e) => e.accountCode)));

        const ACCOUNT_NAMES: Record<string, string> = {
          STRIPE_CLEARING: 'Stripe Clearing',
          REVENUE: 'Revenue',
        };

        await tx.account.createMany({
          data: codes.map((code) => ({
            code,
            name: ACCOUNT_NAMES[code] ?? code,
          })),
          skipDuplicates: true,
        });

        // Now safe to insert ledger entries
        await tx.ledgerEntry.createMany({ data: entries as any });
      }

      await tx.stripeEvent.update({
        where: { eventId: event.id },
        data: { processedAt: new Date() },
      });
    });
  }
}
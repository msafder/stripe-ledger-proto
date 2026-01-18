import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [StripeModule, LedgerModule],
  controllers: [StripeWebhookController]
})
export class WebhooksModule {}

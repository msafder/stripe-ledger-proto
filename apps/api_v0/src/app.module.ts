import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';
import { LedgerModule } from './ledger/ledger.module';
import { CheckoutModule } from './checkout/checkout.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [PrismaModule, StripeModule, LedgerModule, CheckoutModule, WebhooksModule]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [CheckoutController]
})
export class CheckoutModule {}

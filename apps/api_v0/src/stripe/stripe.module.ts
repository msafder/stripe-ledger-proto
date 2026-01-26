import { Module } from '@nestjs/common';
import { stripeProvider } from './stripe.provider';

@Module({
  providers: [stripeProvider],
  exports: [stripeProvider]
})
export class StripeModule {}

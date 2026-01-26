import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksModule } from './webhooks/webhooks.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [WebhooksModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

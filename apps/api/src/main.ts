import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  // Disable Nest's default bodyParser so we can mount raw parsing for Stripe webhooks
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Stripe webhooks MUST receive raw bytes for signature verification
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));  

  // Normal JSON parsing for other routes
  app.use(express.json());

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}
bootstrap();

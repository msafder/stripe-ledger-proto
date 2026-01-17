import Stripe from 'stripe';

export const STRIPE_CLIENT = Symbol('STRIPE_CLIENT');

export const stripeProvider = {
  provide: STRIPE_CLIENT,
  useFactory: () => {
    const apiVersion = process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion | undefined;

    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion
    });
  }
};

# Stripe Ledger Prototype (Next.js + NestJS + Postgres + Stripe CLI)

A small, best-practices prototype that demonstrates:

- Creating **Stripe Checkout Sessions** (one-time payments)
- Receiving and verifying **Stripe webhooks** using the **raw request body**
- Writing webhook events into Postgres and translating them into an **append-only ledger**
- Running everything with **docker compose**, including **Stripe CLI** for local webhook forwarding

## Prereqs

- Docker / Docker Compose
- A Stripe test secret key (`sk_test_...`)
- A Stripe **Price ID** (one-time price), e.g. `price_...`

## Setup

1) Copy env and fill it out:

```bash
cp .env.example .env
```

Fill:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`

2) Start everything:

```bash
docker compose up --build
```

3) Get the webhook signing secret (local)

The `stripe-cli` container runs a webhook listener and forwards events to the API container:

- Forward target: `http://api:3000/webhooks/stripe`

You need to set `STRIPE_WEBHOOK_SECRET` to the `whsec_...` value printed by the Stripe CLI listener.
If you started compose without it, update `.env` and restart:

```bash
docker compose down
docker compose up --build
```

4) Use the app

- Web UI: http://localhost:3001/pricing
- API: http://localhost:3000

Click **Buy** → complete a test Checkout payment.

## What to inspect

Postgres is exposed on `localhost:5432`:

- user: `app`
- pass: `app`
- db: `app`

Tables:
- `StripeEvent`: raw webhook events, unique by `eventId`
- `LedgerEntry`: append-only ledger entries keyed by Stripe event id
- `Account`: ledger account codes (seeded)

## Notes

- This prototype uses `prisma db push` on startup for simplicity (no migrations folder).
- Webhook signature verification requires the **raw request body**; the API disables Nest’s default body parser and mounts a raw parser only for `/webhooks/stripe`.

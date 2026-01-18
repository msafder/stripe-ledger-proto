export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

async function getStatus(sessionId: string) {
  const r = await fetch(`${API_BASE}/checkout/status?session_id=${encodeURIComponent(sessionId)}`, {
    cache: "no-store",
  });
  return r.json();
}

export default async function SuccessPage({ searchParams }: any) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return (
      <main>
        <h1>Success</h1>
        <p>Missing <code>session_id</code>. This page is normally visited from Stripe Checkout.</p>
        <p><a href="/pricing">Back to pricing</a></p>
      </main>
    );
  }

  const status = await getStatus(sessionId);

  const stripe = status?.stripe;
  const db = status?.db;

  return (
    <main>
      <h1>Success</h1>

      <p>
        Checkout session: <code>{sessionId}</code>
      </p>

      {stripe?.payment_status ? (
        <>
          <p>
            Stripe: <b>{stripe.payment_status}</b> (session: {stripe.status})
          </p>
          <p>
            Total: <b>{(stripe.amount_total ?? 0) / 100} {String(stripe.currency ?? "").toUpperCase()}</b>
          </p>
        </>
      ) : (
        <p><b>Stripe:</b> {status?.error ?? "Unknown"}</p>
      )}

      <p>
        Webhook → Postgres:{" "}
        {db?.processed ? <b>processed ✅</b> : <b>pending…</b>}{" "}
        (ledger entries: {db?.ledger_entries ?? 0})
      </p>

      <p style={{ marginTop: 16 }}>
        <a href="/admin">View in admin</a>
        {" · "}
        <a href="/pricing">Back to pricing</a>
      </p>

      {!db?.processed && (
        <p style={{ marginTop: 12, opacity: 0.8 }}>
          If this says “pending…”, wait a moment and refresh — Stripe webhooks are async and may arrive after the redirect.
        </p>
      )}
    </main>
  );
}

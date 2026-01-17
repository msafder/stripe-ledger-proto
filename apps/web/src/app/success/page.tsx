export default function SuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main>
      <h1>Success</h1>
      <p>Checkout session: <code>{searchParams.session_id ?? "(missing)"}</code></p>
      <p>
        The redirect is not the source of truth — the webhook writes to Postgres.
        Check <code>StripeEvent</code> + <code>LedgerEntry</code>.
      </p>
      <p><a href="/pricing">Back to pricing</a></p>
    </main>
  );
}

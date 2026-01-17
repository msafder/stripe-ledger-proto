"use client";

export default function PricingPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const startCheckout = async () => {
    const r = await fetch(`${apiUrl}/checkout/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId })
    });

    const data = await r.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    alert(data?.error ?? "Failed to create Checkout session");
  };

  return (
    <main>
      <h1>Pricing</h1>
      <p>One-time purchase via Stripe Checkout.</p>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Demo Product</h2>
        <p>Uses your <code>STRIPE_PRICE_ID</code> from <code>.env</code>.</p>
        <button onClick={startCheckout} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111" }}>
          Buy
        </button>
      </div>

      <p style={{ marginTop: 24 }}>
        After payment, check Postgres tables: <code>StripeEvent</code> and <code>LedgerEntry</code>.
      </p>
    </main>
  );
}

"use client";

export default function PricingPage() {
  const startCheckout = async () => {
    const r = await fetch("/api/checkout", { method: "POST" });
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
        <button onClick={startCheckout} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111" }}>
          Buy
        </button>
      </div>
    </main>
  );
}

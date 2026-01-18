import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  if (!apiUrl || !priceId) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_API_URL or NEXT_PUBLIC_STRIPE_PRICE_ID" },
      { status: 500 }
    );
  }

  const r = await fetch(`${apiUrl}/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
    cache: "no-store",
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}

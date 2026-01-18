import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

  const r = await fetch(`${apiUrl}/checkout/create`, {
    method: "POST",
    cache: "no-store",
  });

  const text = await r.text();

  // Pass-through errors cleanly
  if (!r.ok) {
    return new NextResponse(text, { status: r.status });
  }

  // Expecting { url: "https://checkout.stripe.com/..." }
  return new NextResponse(text, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

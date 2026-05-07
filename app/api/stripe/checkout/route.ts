import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";

  if (!priceId) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_PRICE_ID fehlt." },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Bitte lade zuerst einen Brief hoch oder starte neu." },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: profile?.stripe_customer_id ?? undefined,
    client_reference_id: user.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      product: "einfachamt_plus",
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        product: "einfachamt_plus",
      },
    },
    success_url: `${siteUrl}/pricing?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}

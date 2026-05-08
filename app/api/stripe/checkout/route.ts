import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://127.0.0.1:3000";
  const withProtocol = rawUrl.startsWith("http")
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/$/, "");
}

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    const siteUrl = getSiteUrl();

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_PRICE_ID fehlt in Vercel." },
        { status: 500 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Keine aktive Sitzung gefunden. Bitte lade die Seite neu und versuche es erneut.",
        },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Supabase profiles Tabelle fehlt oder ist nicht erreichbar. Bitte Migration 002_subscriptions.sql ausfuehren.",
        },
        { status: 500 },
      );
    }

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
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Stripe Checkout konnte nicht gestartet werden.",
      },
      { status: 500 },
    );
  }
}

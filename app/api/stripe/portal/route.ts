import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSafeUser } from "@/lib/supabase/safe-auth";
import { createClient } from "@/lib/supabase/server";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://127.0.0.1:3000";
  return (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/$/, "");
}

export async function POST() {
  const user = await getSafeUser();
  if (!user || user.is_anonymous) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Kein Stripe-Konto gefunden." }, { status: 404 });
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    configuration: "bpc_1TVqE40lwubQaNUreIUak2mH",
    return_url: `${getSiteUrl()}/account`,
  });

  return NextResponse.json({ url: session.url });
}

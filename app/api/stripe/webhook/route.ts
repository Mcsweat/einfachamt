import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { sendSubscriptionConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

function subscriptionStatus(status: Stripe.Subscription.Status) {
  return status;
}

async function upsertSubscription({
  userId,
  customerId,
  subscriptionId,
  status,
  productType = "plus",
}: {
  userId: string;
  customerId: string;
  subscriptionId: string;
  status: Stripe.Subscription.Status;
  productType?: "plus" | "antrag";
}) {
  const supabase = createAdminClient();

  if (productType === "antrag") {
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        antrag_stripe_subscription_id: subscriptionId,
        antrag_subscription_status: subscriptionStatus(status),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: subscriptionStatus(status),
        plan: status === "active" || status === "trialing" ? "plus" : "free",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
  }
}

function detectProductType(metadata?: Stripe.Metadata | null): "plus" | "antrag" {
  return metadata?.product === "einfachamt_antrag" ? "antrag" : "plus";
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") {
    return;
  }

  const userId = session.client_reference_id ?? session.metadata?.user_id;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!userId || !customerId || !subscriptionId) {
    return;
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const productType = detectProductType(session.metadata);

  await upsertSubscription({
    userId,
    customerId,
    subscriptionId,
    status: subscription.status,
    productType,
  });

  // Send confirmation email (fire-and-forget — never block the webhook)
  if (subscription.status === "active" || subscription.status === "trialing") {
    const supabase = createAdminClient();
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (email) {
      sendSubscriptionConfirmationEmail({
        to: email,
        language: "de",
        plan: productType,
      }).catch(() => {}); // ignore email errors
    }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  if (!userId) {
    return;
  }

  const productType = detectProductType(subscription.metadata);

  await upsertSubscription({
    userId,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
    productType,
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json(
      { ok: false, error: "Stripe Webhook ist nicht konfiguriert." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Stripe Signatur konnte nicht geprueft werden.",
      },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await handleSubscriptionChange(event.data.object);
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Stripe Webhook konnte nicht verarbeitet werden.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

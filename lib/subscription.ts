import { createClient } from "@/lib/supabase/server";
import { getSafeUser } from "@/lib/supabase/safe-auth";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "none";

export function isPaidSubscription(status?: string | null) {
  return status === "active" || status === "trialing";
}

export async function getCurrentUserSubscription() {
  const supabase = await createClient();
  const user = await getSafeUser();

  if (!user) {
    return {
      userId: null,
      status: "none" as SubscriptionStatus,
      isPaid: false,
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const status = (data?.subscription_status ?? "none") as SubscriptionStatus;

  return {
    userId: user.id,
    status,
    stripeCustomerId: data?.stripe_customer_id ?? null,
    isPaid: isPaidSubscription(status),
  };
}

/** Separate check for the Antrag plan (€39.99/month) */
export async function getCurrentUserAntragSubscription() {
  const supabase = await createClient();
  const user = await getSafeUser();

  if (!user) {
    return { userId: null, isPaid: false };
  }

  const { data } = await supabase
    .from("profiles")
    .select("antrag_subscription_status, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const status = (data?.antrag_subscription_status ?? "none") as SubscriptionStatus;

  return {
    userId: user.id,
    stripeCustomerId: data?.stripe_customer_id ?? null,
    isPaid: isPaidSubscription(status),
    status,
  };
}

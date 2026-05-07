# EinfachAmt Stripe Setup

Use Stripe test mode first.

## 1. Create the product

Stripe Dashboard -> Product catalog -> Add product:

- Name: `EinfachAmt Plus`
- Price: `9 EUR`
- Billing: monthly recurring

Copy the recurring price ID. It starts with `price_`.

## 2. Add Vercel environment variables

Vercel -> Project -> Settings -> Environment Variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://your-domain.de
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Use `Production and Preview`, then redeploy.

## 3. Add the Stripe webhook

Stripe Dashboard -> Developers -> Webhooks -> Add endpoint:

```text
https://your-domain.de/api/stripe/webhook
```

Events to send:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

After creating the endpoint, copy its signing secret into:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Run the Supabase migration

Run this SQL in Supabase SQL Editor:

```text
supabase/migrations/002_subscriptions.sql
```

It creates `profiles`, where Stripe subscription status is stored.

## 5. Test Checkout

Open:

```text
https://your-domain.de/pricing
```

Click `Plus freischalten`.

Use Stripe test card:

```text
4242 4242 4242 4242
```

Any future expiry date, any CVC.

## 6. Verify Plus access

After payment, Stripe sends the webhook. Then open:

```text
https://your-domain.de/api/ocr/status
```

Expected for the paid browser session:

```json
{
  "subscriptionStatus": "active",
  "hasActiveSubscription": true,
  "googleEnabled": true
}
```

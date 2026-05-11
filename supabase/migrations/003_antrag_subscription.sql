-- Separate subscription columns for the Antrag plan (€39.99/month)
-- Run this in Supabase SQL Editor after 002_subscriptions.sql

alter table public.profiles
  add column if not exists antrag_subscription_status text not null default 'none',
  add column if not exists antrag_stripe_subscription_id text unique;

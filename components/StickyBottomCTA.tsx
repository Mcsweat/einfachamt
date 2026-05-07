import { StickyCTA } from "@/components/StickyCTA";

type StickyBottomCTAProps = {
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function StickyBottomCTA(props: StickyBottomCTAProps) {
  return <StickyCTA {...props} />;
}

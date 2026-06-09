export type SlideItem = {
  id: string;
  src: string;
  /** Main hero heading drawn over the image. */
  title: string;
  /** Optional sub-heading rendered under the title. */
  subtitle?: string;
  /** Optional CTA button label. When omitted the button is hidden. */
  ctaLabel?: string;
  /** Optional CTA destination (defaults to "#"). */
  ctaHref?: string;
};

export type ShowcaseSlides = SlideItem[];

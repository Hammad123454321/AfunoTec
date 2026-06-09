"use client";

import Showcase from "@/components/Showcase";
import { ShowcaseSlides } from "@/types/showcase.type";

const sliderImages: ShowcaseSlides = [
  {
    id: "1",
    src: "/heroImage1.png",
    title: "Discover Madagascar Your Way",
    subtitle:
      "Hotels, tours, transfers and activities — all booked from one platform with local prices, instant Mvola / Airtel / Orange payments and 7/7 support.",
    ctaLabel: "Explore Deals",
    ctaHref: "/stays",
  },
  {
    id: "2",
    src: "/resort2.png",
    title: "Stays Made for Locals",
    subtitle:
      "Handpicked hotels, villas and lodges at real Malagasy rates — no inflated tourist prices, no hidden fees.",
    ctaLabel: "Browse Stays",
    ctaHref: "/stays",
  },
  {
    id: "3",
    src: "/resort4.jpg",
    title: "Unforgettable Adventures Await",
    subtitle:
      "From canyoning at Tamarind Falls to lemur safaris in Andasibe — book the best of Madagascar in just a few clicks.",
    ctaLabel: "Find Activities",
    ctaHref: "/things-to-do",
  },
];

export default function HomeShowcase() {
  return <Showcase slides={sliderImages} />;
}

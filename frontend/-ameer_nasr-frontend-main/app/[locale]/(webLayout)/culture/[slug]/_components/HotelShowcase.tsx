"use client";

import Showcase from "@/components/Showcase";
import { ShowcaseSlides } from "@/types/showcase.type";

const sliderImages: ShowcaseSlides = [
  {
    id: "1",
    src: "/heroImage1.png",
    title: "Beautiful Beach View",
  },
  {
    id: "2",
    src: "/resort2.png",
    title: "Luxury Resort View",
  },
  {
    id: "3",
    src: "/resort4.jpg",
    title: "Mountain Side Resort",
  },
];

export default function HotelShowcase() {
  return <Showcase slides={sliderImages} />;
}

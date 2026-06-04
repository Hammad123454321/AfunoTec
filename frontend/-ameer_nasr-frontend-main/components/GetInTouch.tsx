"use client";

import { FaPhoneAlt, FaEnvelope, FaRobot, FaWhatsapp } from "react-icons/fa";
import Container from "./layout/Container";
import Heading from "./Heading";
import Section from "./layout/Section";
import { openChat } from "@/lib/chatEvents";
import { JSX } from "react";

// TODO(client): real AfunoTec phone / email / WhatsApp number need to
// be provided. Until then these stay as placeholders so the layout
// renders + the right href shape is in place.
const CONTACT = {
  phoneBusiness: "+261 269 1500",
  email: "info@afunotec.com",
  whatsappE164: "33344552522", // no leading + for wa.me
  whatsappDisplay: "+333 44552522",
};

type Tile = {
  id: string;
  icon: JSX.Element;
  title: string;
  subtitle: string;
  /** Tailwind text + border colors for the round icon ring. */
  color: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
};

const TILES: ReadonlyArray<Tile> = [
  {
    id: "phone",
    icon: <FaPhoneAlt className="text-lg" aria-hidden />,
    title: CONTACT.phoneBusiness,
    subtitle: "Business Hours Number",
    color: "text-[#3d83f5] border-[#3d83f5]",
    href: `tel:${CONTACT.phoneBusiness.replace(/\s+/g, "")}`,
  },
  {
    id: "email",
    icon: <FaEnvelope className="text-lg" aria-hidden />,
    title: CONTACT.email,
    subtitle: "Send Us a Message",
    color: "text-[#68d7c6] border-[#68d7c6]",
    href: `mailto:${CONTACT.email}`,
  },
  {
    id: "chat",
    icon: <FaRobot className="text-lg" aria-hidden />,
    title: "Chat Now!",
    subtitle: "Talk in real time",
    color: "text-[#f49d0d] border-[#f49d0d]",
    onClick: openChat,
  },
  {
    id: "whatsapp",
    icon: <FaWhatsapp className="text-lg" aria-hidden />,
    title: CONTACT.whatsappDisplay,
    subtitle: "Contact us on WhatsApp",
    color: "text-[#28c562] border-[#28c562]",
    href: `https://wa.me/${CONTACT.whatsappE164}`,
    external: true,
  },
];

function Tile({ tile }: { tile: Tile }) {
  const inner = (
    <>
      <div
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${tile.color}`}
      >
        {tile.icon}
      </div>
      <h3 className="font-semibold text-lg md:text-xl mb-1">{tile.title}</h3>
      <p className="text-sm text-gray-600">{tile.subtitle}</p>
    </>
  );

  const baseClass =
    "flex flex-col items-center text-center relative group cursor-pointer transition-transform hover:scale-105 border border-gray-200 p-4 rounded-xl bg-white";

  if (tile.href) {
    return (
      <a
        href={tile.href}
        className={baseClass}
        target={tile.external ? "_blank" : undefined}
        rel={tile.external ? "noopener noreferrer" : undefined}
        aria-label={`${tile.title} — ${tile.subtitle}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={tile.onClick}
      className={`${baseClass} text-left`}
      aria-label={`${tile.title} — ${tile.subtitle}`}
    >
      {inner}
    </button>
  );
}

export default function GetInTouch() {
  return (
    <Section>
      <div className="flex h-1.5">
        <div className="w-1/3 bg-red-200"></div>
        <div className="w-2/3 bg-red-500"></div>
        <div className="w-2/3 bg-green-600"></div>
      </div>

      <Heading
        size="h3"
        as="h2"
        align="center"
        className="flex items-center justify-center mt-8"
      >
        Get <span className="text-[#2d9e4f]">In Touch</span>
      </Heading>
      <p className="text-center">
        Have a question or need help choosing? We&apos;re here for you — by
        phone, email, or WhatsApp.
      </p>

      <Container className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TILES.map((tile) => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

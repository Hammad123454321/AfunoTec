import { FaPhoneAlt, FaEnvelope, FaRobot, FaWhatsapp } from "react-icons/fa";
import Container from "./layout/Container";
import Heading from "./Heading";
import Section from "./layout/Section";

const contactData = [
  {
    id: 1,
    icon: <FaPhoneAlt className="text-lg" />,
    title: "269 1500",
    subtitle: "Business Hours Number",
    color: "text-[#3d83f5] border-[#3d83f5]",
  },
  {
    id: 2,
    icon: <FaEnvelope className="text-lg" />,
    title: "info@baodeal.net",
    subtitle: "Send Us a Message",
    color: "text-[#68d7c6] border-[#68d7c6]",
  },
  {
    id: 3,
    icon: <FaRobot className="text-lg" />,
    title: "Chat Now!",
    subtitle: "Talk in real time",
    color: "text-[#f49d0d] border-[#f49d0d]",
  },
  {
    id: 4,
    icon: <FaWhatsapp className="text-lg" />,
    title: "+333 44552522",
    subtitle: "Contact us on whatsapp",
    color: "text-[#28c562] border-[#28c562]",
  },
];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {contactData.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center relative group cursor-pointer transition-transform hover:scale-105 border border-gray-200 p-4 rounded-xl"
            >
              {/* Divider */}
              {index !== 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-32 " />
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg md:text-xl mb-1">
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

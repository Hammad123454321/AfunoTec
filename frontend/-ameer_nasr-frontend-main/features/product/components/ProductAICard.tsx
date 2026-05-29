import { Star, Lightbulb, Info, Heart, MapPin, Share2 } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

// Types
interface CardItem {
  icon?: string;
  text: string;
}

interface CardSection {
  title: string;
  bgColor: string;
  iconType: "star" | "info" | "lightbulb";
  items: CardItem[];
}

interface ActivityDetails {
  routes: string[];
  name: string;
  description: string;
  rating: number;
}

interface ProductDetailsCardProps {
  activity?: ActivityDetails;
  sections?: CardSection[];
}

// Icon mapping
const iconMap = {
  star: Star,
  info: Info,
  lightbulb: Lightbulb,
};

const defaultSections: CardSection[] = [
  {
    title: "Package Highlights:",
    bgColor: "bg-yellow-500",
    iconType: "star",
    items: [
      { text: "Venture out in rich diversity of landscape and wildlife" },
      { text: "Enjoy an exciting single or double 2-hour Quad or Buggy ride" },
      { text: "Spot some rare endemic birds" },
      { text: "Thrilling Off-Road Adventure" },
    ],
  },
  {
    title: "Activity Information:",
    bgColor: "bg-green-600",
    iconType: "info",
    items: [
      { text: "Region: South" },
      { text: "Activity Time: 09h30 or 14h00" },
      { text: "Age Restriction: +16 years old" },
      {
        text: "Health Restrictions: This activity is not meant for physically challenged persons or pregnant women.",
      },
    ],
  },
  {
    title: "Good To Know:",
    bgColor: "bg-red-600",
    iconType: "lightbulb",
    items: [
      { text: "No previous quad bike experience is needed." },
      {
        text: "The Management reserves the right to cancel the activity in case of bad weather.",
      },
    ],
  },
];

export default function ProductAICard({ sections = defaultSections }) {
  return (
    <Section padding="sm">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {sections.map((section, index) => {
            const IconComponent = iconMap[section.iconType];

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className={`${section.bgColor} text-white font-semibold p-3`}
                >
                  {section.title}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <IconComponent
                        size={16}
                        className="text-gray-600 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-gray-700 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

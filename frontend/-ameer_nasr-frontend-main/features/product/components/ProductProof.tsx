import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

interface WhyStayHereProps {
  title?: string;
  highlightText?: string;
  subtitle: string;
  description: string;
  features: string[][];
}

export function WhyStayHere({
  title = "WHY",
  highlightText = "STAY HERE?",
  subtitle,
  description,
  features,
}: WhyStayHereProps) {
  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="mb-8 text-2xl md:text-4xl font-semibold">
        <span className="uppercase">{title} </span>
        <span className="text-green-600 uppercase underline decoration-green-500 decoration-4 underline-offset-8">
          {highlightText}
        </span>
      </h2>

      {/* Content */}
      <div className="space-y-6">
        {/* Subtitle */}
        <p className="text-green-600 font-semibold text-lg">{subtitle}</p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{description}</p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {features.map((column, colIndex) => (
            <ul
              key={colIndex}
              className="list-disc marker:text-green-600 marker:text-xl pl-5 space-y-2"
            >
              {column.map((feature, index) => (
                <li key={index} className="leading-6 text-gray-700">
                  {feature}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

// Example Usage
export default function ExampleUsage() {
  // This would come from your API
  const stayData = {
    subtitle: "Riu Turquoise (All Inclusive) - Overview",
    description:
      "The newly renovated Hotel Riu Turquoise in Mauritius is the ultimate destination for a family holiday on the stunning beaches of Le Morne Peninsula. With RIU's exclusive 24-hour All-Inclusive service, families can enjoy an unforgettable getaway in one of the world's most beautiful locations. Whether you're lounging by the pool or exploring the array of activities tailored for all ages, including rejuvenating experiences at the Renova Spa, your dream holiday awaits in the embrace of paradise.",
    features: [
      [
        "All Inclusive Beachfront Resort",
        "4 Bars",
        "4 Restaurants",
        "4 Swimming Pools",
        "Kids Club",
        "Gym & Wellness Centre",
      ],
      [
        "Complimentary activities",
        "Gift Shop",
        "Daily Entertainments",
        "Evening Programme",
        "Free Wi-Fi",
      ],
    ],
  };

  return (
    <Section align="left">
      <Container>
        <div className="max-w-xl">
          {/* Default usage */}
          <div>
            <WhyStayHere
              subtitle={stayData.subtitle}
              description={stayData.description}
              features={stayData.features}
            />
          </div>

          {/* Custom title */}
          {/* <div className="w-full md:w-2/3">
        <WhyStayHere
          title="REASONS TO"
          highlightText="BOOK WITH US"
          subtitle={stayData.subtitle}
          description={stayData.description}
          features={stayData.features}
        />
      </div> */}

          {/* With API data */}
          {/* <div className="w-full">
        <WhyStayHere
          title="DISCOVER"
          highlightText="OUR AMENITIES"
          subtitle="Luxury Resort Experience"
          description="Experience world-class hospitality with our comprehensive range of facilities and services designed to make your stay unforgettable."
          features={[
            [
              "24/7 Room Service",
              "Private Beach Access",
              "Olympic-sized Pool",
              "Spa & Wellness Center",
            ],
            [
              "Fine Dining Restaurants",
              "Kids Entertainment Zone",
              "Water Sports Activities",
              "Complimentary Parking",
            ],
          ]}
        />
      </div> */}
        </div>
      </Container>
    </Section>
  );
}

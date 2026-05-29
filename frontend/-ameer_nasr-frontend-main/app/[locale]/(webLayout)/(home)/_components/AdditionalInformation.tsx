import Image from "next/image";

// Define the data type
type InfoImageType = {
  id: number;
  image: string;
  title: string;
  bgColor: string;
};

// Sample data
const infoImages: InfoImageType[] = [
  {
    id: 1,
    image: "/additionalInformationShakingHand.jpg",
    title: "How to order on Company",
    bgColor: "bg-[#1BA0E2]",
  },
  {
    id: 2,
    image: "/additionalInformationChart.png",
    title: "Promote your business",
    bgColor: "bg-[#F3AF1B]",
  },
  {
    id: 3,
    image: "/addtionalInformationCompass.png",
    title: "Why we are the best",
    bgColor: "bg-[#017E3A]",
  },
  {
    id: 4,
    image: "/additionalInformationGift.png",
    title: "Deals loyalty program",
    bgColor: "bg-[#DA001C]",
  },
];

export default function AdditionalInformation() {
  return (
    <div className="max-w-[1320px] mx-auto my-8 px-4">
      <div className="mt-12 md:mt-20 mb-9 flex items-center justify-center">
        <h2 className="text-2xl md:text-4xl font-semibold text-center text-black leading-11">
          Additional <span className="text-[#5F9111]">Information</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoImages.map((info) => (
          <div key={info.id} className="w-full">
            <Image
              src={info.image}
              alt={info.title}
              width={312}
              height={312}
              className="w-full h-[312px] object-cover "
            />
            <div
              className={`w-full h-[77px] flex items-center justify-center text-white text-center text-2xl leading-7 font-semibold py-4 px-2 ${info.bgColor}`}
            >
              {info.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

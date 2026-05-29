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
    image: "/corporateImage2.png",
    title: "Special 10-30% discount on selected deals",
    bgColor: "bg-[#1BA0E2]",
  },
  {
    id: 2,
    image: "/corporateImage3.png",
    title: "Dedicated-personal assistance 7 days / week",
    bgColor: "bg-[#22A628]",
  },
  {
    id: 3,
    image: "/corporateImage5.png",
    title: "Access to exclusive list of Corporate offers",
    bgColor: "bg-[#FEDA00]",
  },
  {
    id: 4,
    image: "/corporateImage4.png",
    title: "A fixed 5% discount on over 500+ Deals",
    bgColor: "bg-[#DA001C]",
  },
];

export default function CorporateCustomer() {
  return (
    <div className="max-w-[1320px] mx-auto my-8 px-4">
      <div className="mt-12 md:mt-18 mb-8 flex items-center justify-center">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-black leading-11">
          baodeal.net Corporate Customers Benefit from:
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

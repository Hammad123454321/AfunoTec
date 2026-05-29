import Image from "next/image";
import Link from "next/link";
import React from "react";

type TravelCardProps = {
  title: string;
  image: string;
  id: number;
};

const ImageCard = ({ id, title, image }: TravelCardProps) => {
  return (
    <Link href={`travels/${id}`}>
      <div className="relative">
        <img
          src={image}
          alt="Our package"
          className="object-cover relative w-full h-96"
          // sizes="100vw"
          // width={318}
          // height={318}
        />

        {/* Blue label box */}
        <div className="absolute bottom-0 w-full">
          <div className="bg-[#2F2F2F]/4 backdrop-blur-sm px-10 py-3.5    ">
            <span className="text-xl  font-semibold text-white tracking-wider">
              {title}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;

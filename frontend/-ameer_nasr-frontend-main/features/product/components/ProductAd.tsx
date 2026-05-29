import Image from "next/image";
import { ProductAdType } from "../types/product.types";

export default function ProductAd({ data }: { data: ProductAdType }) {
  return (
    <div className="w-full h-48 relative overflow-hidden">
      <Image
        src={data.image}
        alt="Advertising"
        fill
        className="object-cover"
      />
    </div>
  );
}

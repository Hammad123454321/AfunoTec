import { TextPrimary500 } from "@/components/Text";
import RelatedProducts from "@/features/product/components/ProductRelatedCards";
import { productData } from "@/features/product/data";

export default function RelatedHotels() {
  return (
    <RelatedProducts
      title={
        <>
          Other Great Offers <TextPrimary500>You Should Check</TextPrimary500>
        </>
      }
      items={productData}
    />
  );
}

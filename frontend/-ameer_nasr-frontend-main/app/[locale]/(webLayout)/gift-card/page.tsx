import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Image from "next/image";
import GiftCardDetails from "./_components/GiftCardDetails";
import GiftCardForm from "./_components/GiftCardInfo";

export default function GiftPage() {
  return (
    <Section padding="none">
      <Image
        width={1200}
        height={512}
        alt="main image"
        src="/heroImage1.png"
        className="w-full h-[250px]  md:h-[335px] object-cover"
      />
      <Container>
        <GiftCardForm />
        <GiftCardDetails></GiftCardDetails>
      </Container>
    </Section>
  );
}

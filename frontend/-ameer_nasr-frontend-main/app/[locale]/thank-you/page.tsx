import Heading from "@/components/Heading";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <>
      <Navbar />

      <Section padding="lg">
        <Container>
          <div className="flex flex-col items-center text-center gap-5">
            <Image
              src="/illustrations/thank-you.png"
              alt="Thank you"
              width={250}
              height={250}
              className="mb-4"
            />

            <Heading as="h1" size="h2" className="text-primary-500">
              Thank You
            </Heading>

            <Heading as="h2" size="h4" className="text-primary-500 -mt-2">
              Payment Done Successfully
            </Heading>

            <p className="text-muted-foreground max-w-md">
              We’ve received your payment and your order is now being processed.
              You’ll receive a confirmation email with the details shortly.
              Thank you for choosing us!
            </p>

            <Link href="/">
              <Button size="lg" className="mt-4">
                Go Home
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Heading from "@/components/Heading";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md"
      >
        <Image
          src="/illustrations/error-travel.svg"
          alt="Error illustration"
          width={320}
          height={240}
          className="mx-auto"
        />

        <Heading size="h4">Something went wrong</Heading>

        <p className="text-gray-600 leading-relaxed">
          We hit a little turbulence! Try refreshing the page or return to the
          homepage.
        </p>

        <div className="flex gap-3 mt-4">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

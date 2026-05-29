"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function Loader() {
  const [textIndex, setTextIndex] = useState(0);

  const messages = [
    "Searching for deals...",
    "Finding great offers...",
    "Comparing prices...",
    "Loading destinations...",
    "Almost there...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-8"
    >
      {/* Logo/Brand Text */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.h2
          className="text-4xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          baodeal.net
        </motion.h2>
      </motion.div>

      {/* Animated Loader with gradient */}
      <motion.div
        variants={itemVariants}
        className="relative w-24 h-24 flex items-center justify-center"
      >
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
        />

        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          className="absolute inset-3 rounded-full border-3 border-transparent border-b-pink-500 border-l-blue-500"
        />

        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Changing text message */}
      <motion.div variants={itemVariants} className="h-8 flex items-center">
        <motion.p
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          {messages[textIndex]}
        </motion.p>
      </motion.div>

      {/* Animated dots */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.2,
            }}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-xs"
      >
        Discovering the best travel deals just for you
      </motion.p>
    </motion.div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white text-black">
      <Loader />
    </div>
  );
}

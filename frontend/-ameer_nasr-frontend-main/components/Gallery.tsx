"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";

interface GalleryProps {
  images: string[];
}

function Gallery({ images }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openGallery = (index: number) => {
    setCurrent(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-2 z-[999]">
        {/* Main Image */}
        <div className="col-span-3 md:col-span-2 h-[465px]">
          <div className="relative w-full h-full">
            <Image
              src={images[0]}
              alt="Main Image"
              fill
              className="object-cover cursor-pointer rounded"
              onClick={() => openGallery(0)}
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="col-span-3 md:col-span-1 grid grid-cols-2 grid-rows-2 gap-2 h-[465px]">
          {images.slice(1, 4).map((img, index) => (
            <div key={index} className="relative w-full h-full overflow-hidden">
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover cursor-pointer rounded"
                onClick={() => openGallery(index + 1)}
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
          ))}

          {/* View All Button */}
          <div
            className="relative w-full h-full overflow-hidden cursor-pointer"
            onClick={() => openGallery(0)}
          >
            <Image
              src={images[4]}
              alt="View Gallery"
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
            <div className="absolute inset-0 bg-black/60 rounded" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 font-semibold text-xs md:text-sm">
              <GrGallery className="w-5 h-5 mb-1" />
              <span>View Gallery</span>
              <span>{images.length} Photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-8 -right-2 md:-top-10 md:-right-10 text-white text-2xl z-50 hover:text-gray-300 transition"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="relative w-full h-[60vh] md:h-[70vh]">
              <Image
                src={images[current]}
                alt="Gallery Image"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            <button
              className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition"
              onClick={prevImage}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>

            <button
              className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition"
              onClick={nextImage}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Thumbnails with Drag Scroll */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-2 mt-6 max-w-5xl cursor-grab active:cursor-grabbing select-none scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-20 h-20 relative rounded border-2 transition ${
                  index === current ? "border-white" : "border-transparent"
                }`}
                onClick={() => !isDragging && setCurrent(index)}
              >
                <Image
                  src={img}
                  alt={`Thumb ${index}`}
                  fill
                  className="object-cover rounded pointer-events-none"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

const images = [
  "/galleryImage1.jpg",
  "/galleryImage2.jpg",
  "/galleryImage3.jpg",
  "/galleryImage2.jpg",
  "/galleryImage3.jpg",
  "/galleryImage1.jpg",
  "/activitiesImage1.png",
  "/galleryImage3.jpg",
];

export default function GalleryComponent() {
  return <Gallery images={images} />;
}

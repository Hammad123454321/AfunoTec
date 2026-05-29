import banner1 from '@/public/banner-img/banner-1.webp';
import banner2 from '@/public/banner-img/banner-2.webp';
import banner3 from '@/public/banner-img/banner-3.webp';
import banner4 from '@/public/banner-img/banner-4.jpg';
import banner5 from '@/public/banner-img/banner-5.jpg';
import { Card, CardContent } from '@/components/ui/card';

import {
  CarouselContent,
  CarouselNext,
  CarouselItem,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import AutoPlayCarosel from './FeaturedAutoplay';
import { ShowcaseSlides } from '@/types/showcase.type';

const sliderImages: ShowcaseSlides = [
  {
    id: "1",
    src: "/heroImage1.png",
    title: "Beautiful Beach View",
  },
  {
    id: "2",
    src: "/resort2.png",
    title: "Luxury Resort View",
  },
  {
    id: "3",
    src: "/resort4.jpg",
    title: "Mountain Side Resort",
  },
];

const Slider = () => {
  return (
    <AutoPlayCarosel>
      <CarouselContent className='-ml-1'>
        {sliderImages.map((sli) => (
          <CarouselItem
            key={sli.id}
            className=' pl-1 md:basis-1/1 lg:basis-1/1'>
            <div className='p-1'>
              <Card className=' py-0 lg:h-[400px] border-none shadow-none '>
                <CardContent className='px-0 relative w-full h-48 md:h-72 lg:h-96 overflow-hidden'>
                  <img
                    src={sli.src}
                    className='rounded w-full h-full object-cover'
                    alt=''
                   
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
       <CarouselPrevious />
      <CarouselNext />
    </AutoPlayCarosel>
  );
};

export default Slider;
'use client';
import { Carousel } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

const AutoPlayCarosel = ({ children }) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className='w-full   mx-auto'>
      {children}
    </Carousel>
  );
};

export default AutoPlayCarosel;
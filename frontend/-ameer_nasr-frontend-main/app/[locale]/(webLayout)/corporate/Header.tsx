import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <div>
        <div className=''>
            <Image 
            width={1200} height={512} 
            alt='corporate image' 
            src='/corporateImage.jpg'
            className="w-full h-[250px]  md:h-[600px] object-cover"></Image>
        </div>
    </div>
  )
}

import Image from "next/image"
import TravelImg from '@/public/travelImg.jpg'

const TravelSectionImage = () => {
  return (
    <div className="container mx-auto">
      <img 
        src='/travelImg.jpg'
        alt="Travel Section"
        className="w-[1370px] h-[270px] bg-cover mx-auto rounded-2xl"
      />
    </div>
  )
}

export default TravelSectionImage

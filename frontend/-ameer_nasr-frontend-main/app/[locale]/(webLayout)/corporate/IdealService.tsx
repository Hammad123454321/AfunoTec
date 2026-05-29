import Image from 'next/image'
import React from 'react'

export default function IdealService() {
     const benefits = [
    { img: "/corporatePercentage.png", text: "Staff Discounts" },
    { img: "/corporateShakeHand.png", text: "Employees Incentives" },
    { img: "/corporatePeople.png", text: "Group Bookings" },
    { img: "/corporateBag.png", text: "End of year Events" },
    { img: "/corporateGroup.png", text: "Team Building" },
    { img: "/corporateBadge.png", text: "Executive Offers" },
  ];
  return (
    <div className='bg-[#F4F4F4] text-center '>
     <h2 className=' pt-10 pb-8 text-xl md:text-2xl'>Ideal Services for Companies:</h2>
     <div className="max-w-[1120px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:gap-x-16 gap-y-8 py-6 px-6">
      {benefits.map((item, idx) => (
        <div key={idx} className="text-center flex flex-col justify-between">
          <div className="flex justify-center">
            <Image src={item.img} width={100} height={100} alt={item.text} />
          </div>
          <p className="pt-4">{item.text}</p>
        </div>
      ))}
    </div>
    </div>
  )
}
       
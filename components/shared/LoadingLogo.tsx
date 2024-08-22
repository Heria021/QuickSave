import Image from "next/image";
import React from "react"

type props = {
    size?: number;
}

function LoadingLogo({size = 100}: props){
  return (
    <div className=" h-full w-full flex justify-center items-center">
      <Image src={'/vercel.svg'} alt="logo" width={size} height={size} className=" animate-pulse duration-800" />
    </div>
  )
};

export default LoadingLogo;

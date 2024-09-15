import { Bike } from "lucide-react";
import Image from "next/image";
import React from "react"

type props = {
  size?: number;
}

function LoadingLogo({ size = 100 }: props) {
  return (
    <div className=" animate-pulse duration-500 text-foreground h-full w-full flex flex-col gap-1 justify-center items-center">
      <Bike size={56} strokeWidth={1.8} ></Bike>
      <p className=" text-4xl ">Quick Save</p>
    </div>
  )
};

export default LoadingLogo;

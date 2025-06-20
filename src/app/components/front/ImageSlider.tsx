"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface iAppProps {
    images: string[];
}

export function ImageSlider({ images }: iAppProps) {
    const [mainImageIndex, setMainImageIndex] = useState(0);
    function handlePreviousClick()  {
        setMainImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }
    function handleNextClick () {
        setMainImageIndex((prevIndex) => 
            prevIndex ===  images.length - 1  ? 0 : prevIndex + 1
        );
    }
    function handleImageClick (index: number) {
        setMainImageIndex(index)

    }
    return (
        <div className="grid gap-6 md:gap-3 items-start">
            <div className="relative overflow-hidden rounded-lg">
                <Image className="object-cover w-{600px} h-{600px}" width={600} height={600} src={images[mainImageIndex]} alt="Product Image"/>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <Button onClick={handlePreviousClick}  variant="outline" size="icon">
                        <ChevronLeft className="w-6 h-6 fill-blue-600" />
                    </Button>
                    <Button onClick={handleNextClick} variant="outline" size="icon">
                        <ChevronRight className="w-6 h-6 fill-blue-600" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                    <div className={cn(index === mainImageIndex ? "border-2 border-blue-600" : "border border-gray-200", "relative overflow-hidden rouded-lg cursor-pointer")} key={index} onClick={() =>handleImageClick(index)}>
                        <Image className="object-cover w-{100px} h-{100px}" width={100} height={100} src={image} alt="Product Image" />
                    </div>
                ))}
            </div>
        </div>
    );
}
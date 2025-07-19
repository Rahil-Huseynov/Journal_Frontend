"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect } from "react"
import { useCarousel } from "./ui/carouselNews"

interface ImageCarouselProps {
  images: { image: string }[]
  altPrefix: string
}

export function ImageCarousel({ images, altPrefix }: ImageCarouselProps) {
  const [api] = useCarousel()

  useEffect(() => {
    if (!api) {
      return
    }

    const interval = setInterval(() => {
      api.scrollNext()
    }, 1000) 

    return () => {
      clearInterval(interval)
    }
  }, [api])

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
        <Image
          src="/placeholder.svg?height=192&width=384"
          alt="No image available"
          width={384}
          height={192}
          className="object-cover w-full h-full"
        />
        <span className="absolute text-sm text-gray-500">No Image Available</span>
      </div>
    )
  }

  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent>
        {images.map((img, index) => {
          return (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="flex aspect-video items-center justify-center rounded-md overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/${img.image}`}
                    alt={`${altPrefix} image ${index + 1}`}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </>
      )}
    </Carousel>
  )
}

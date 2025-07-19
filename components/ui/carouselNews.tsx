"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"

export function useCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollNext = useCallback(() => {
    if (carouselRef.current) {
      const newIndex = (currentIndex + 1) % carouselRef.current.children.length
      setCurrentIndex(newIndex)
      carouselRef.current.scrollTo({
        left: carouselRef.current.children[newIndex].offsetLeft,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  const scrollPrev = useCallback(() => {
    if (carouselRef.current) {
      const newIndex = (currentIndex - 1 + carouselRef.current.children.length) % carouselRef.current.children.length
      setCurrentIndex(newIndex)
      carouselRef.current.scrollTo({
        left: carouselRef.current.children[newIndex].offsetLeft,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1 //scroll-fast
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  return [
    {
      scrollNext,
      scrollPrev,
    },
  ]
}

export const Carousel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`relative ${className}`}>{children}</div>
}

export const CarouselContent = ({ children }: { children: React.ReactNode }) => {
  const [api] = useCarousel()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1 //scroll-fast
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div
      ref={carouselRef}
      className="carousel-container relative flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

export const CarouselItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="carousel-item snap-start shrink-0 w-full">{children}</div>
}

export const CarouselPrevious = ({ className }: { className?: string }) => {
  const [api] = useCarousel()
  return (
    <button onClick={api?.scrollPrev} className={className}>
      Previous
    </button>
  )
}

export const CarouselNext = ({ className }: { className?: string }) => {
  const [api] = useCarousel()
  return (
    <button onClick={api?.scrollNext} className={className}>
      Next
    </button>
  )
}

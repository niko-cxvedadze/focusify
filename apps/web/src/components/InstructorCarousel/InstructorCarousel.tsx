import { useEffect, useRef, useState } from 'react'

import { Button } from '@heroui/react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { InstructorCarouselCard } from './InstructorCarouselCard'

interface InstructorCarouselProps {
  className?: string
}

export function InstructorCarousel({ className }: InstructorCarouselProps) {
  const items = Array.from({ length: 7 })
  const sliderRef = useRef<Slider | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides] = useState(items.length)
  const [slidesToShow, setSlidesToShow] = useState(6)

  // Calculate responsive slides to show
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1280) {
        setSlidesToShow(6)
      } else if (window.innerWidth >= 1024) {
        setSlidesToShow(5)
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(4)
      } else {
        setSlidesToShow(2)
      }
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [])

  const settings = {
    dots: false,
    infinite: false,
    draggable: false,
    arrows: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      }
    ]
  }

  const isPrevDisabled = currentSlide === 0
  const isNextDisabled = currentSlide >= totalSlides - slidesToShow

  const handleBeforeChange = (_: number, newIndex: number) => {
    setCurrentSlide(newIndex)
  }

  return (
    <div className={className}>
      {/* Navigation Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <Button
          isIconOnly
          variant="bordered"
          size="sm"
          color="primary"
          isDisabled={isPrevDisabled}
          onPress={() => sliderRef.current?.slickPrev()}
        >
          <IoChevronBack className="w-4 h-4" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          color="primary"
          variant="bordered"
          isDisabled={isNextDisabled}
          onPress={() => sliderRef.current?.slickNext()}
        >
          <IoChevronForward className="w-4 h-4" />
        </Button>
      </div>
      <Slider
        ref={sliderRef}
        {...settings}
        className="flex items-stretch"
        beforeChange={handleBeforeChange}
      >
        {items.map((_, idx) => (
          <div key={idx} className="px-2 h-full">
            <InstructorCarouselCard />
          </div>
        ))}
      </Slider>
    </div>
  )
}


import React from 'react';
import {EmblaOptionsType} from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

// *********** MODULE IMPORTS ***********

import {DotButton, useDotButton} from '@/app/modules/carousels/carouselDots';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from '@/app/modules/carousels/carouselArrows';
import CarouselCard from '@/app/modules/carousels/cardBuilder';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type Slide = {
  id: number,
  title: string,
  image: string,
  description: string,
  link: string,
  linkText: string,
}

type PropType = {
  slides: Slide[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const {slides, options} = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {selectedIndex, scrollSnaps, onDotButtonClick} =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => {
            const {id,
              title,
              image,
              description,
              link,
              linkText,
            } = slide;
            return (
              <div className="embla__slide embla__slide__number" key={index}>
                <CarouselCard
                  id={id}
                  title={title}
                  image={image}
                  description={description}
                  link={link}
                  linkText={linkText}
                />
              </div>
            );
          }
          )}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;

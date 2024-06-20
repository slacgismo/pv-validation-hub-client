// *********** START OF IMPORTS ***********

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Renders a carousel card.
 *
 * @param {number} id - The ID of the card.
 * @param {string} title - The title of the card.
 * @param {string} image - The image URL of the card.
 * @param {string} description - The description of the card.
 * @param {string} link - The link URL of the card.
 * @return {JSX.Element}
 */
export default function CarouselCard({
  id,
  title,
  image,
  description,
  link,
  linkText,
}: {
  id: number,
  title: string,
  image: string,
  description: string,
  link: string,
  linkText: string
  }): React.JSX.Element {
  return (
    <div
      key={id}
      className='
      grid
      grid-column
      justify-center
      content-center
      text-center
      min-w-40
      mr-10
      mt-5
      '
    >
      <div
        key={id}
        className='
        w-full
        overflow-hidden
        relative
        carouselImage
        '
      >
        <Image
          fill={true}
          alt=''
          src={image}
          className='smShadowed'
        />
      </div>
      <div className='text-xl font-bold'>
        {title}
      </div>
      <p>
        {description}
      </p>
      <div className='content-end justify-end text-right mr-3'>
        <Link href={link} className='standardLink'>
          {linkText}
        </Link>
      </div>
    </div>
  );
}

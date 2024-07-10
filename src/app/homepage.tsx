// *********** START OF IMPORTS ***********

import React from 'react';
import Link from 'next/link';
import {EmblaOptionsType} from 'embla-carousel';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import DemoBoard from '@/app/modules/homepage/demoTable';
import EmblaCarousel from '@/app/modules/carousels/carouselBuilder';
import Cards from '@/app/modules/carousels/carousel.json';

// *********** CSS IMPORTS ***********

import '@/app/modules/modulecss/carousel.module.css';

// *********** END OF IMPORTS ***********

const OPTIONS: EmblaOptionsType = {align: 'start'};
const SLIDES = Cards;

/**
 * The Home component is the main page of the app.
 * It displays a welcome message and a link to Vercel's website.
 * @return {JSX.Element} The rendered Home component.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen min-w-screen flex-col
    items-center justify-between p-24">
        <div className="flex flex-col items-center">
        </div>
        <div className='grid grid-cols-2 gap-4 justify-center content-center'>
          <div className="m-2
          flex
          flex-column
          shadow tableBorder
          bg-white
          completeFit
          justify-center">
            <DemoBoard />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold">
              <span className="
              sTextColor">
           PV-
              </span>
           Validation Hub!
            </div>
            <p className="text-lg mt-4 pl-36 items-center">
            Helping developers to validate their pv science algorithms,
            and helping analysts select algorithms for use in their pipelines
            </p>
            <div className="flex flex-row mt-4">
              <Link href="/analyses" className="
              tableBorder
              bg-white
              p-1
              ">
              View Tasks
              </Link>
              <Link href="/login" className="
              tableBorder
              bg-white
              ml-3
              p-1
              ">
              Upload Algorithm
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="
          text-4xl
          font-bold
          mt-10
          justify-center
          text-center
          content-center
          mb-5
          ">
            We help you validate your {' '}
            <span className="
              sTextColor">
           PV
            </span>
            {' '}data science algorithms
          </div>
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>

      </main>
      <Footer />
    </div>
  );
}

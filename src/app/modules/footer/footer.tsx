'use client';
// *********** START OF IMPORTS ***********
import Link from 'next/link';
import Image from 'next/image';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * The Footer component is the footer of the app.
 * @return {JSX.Element} The rendered Footer component.
 */
export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            Powered by{' '}
        <Image src="/vercel.svg" alt="Vercel Logo"
          width={10} height={10} className="h-4 ml-2" />
      </Link>
    </footer>
  );
}

// *********** END OF COMPONENT ***********

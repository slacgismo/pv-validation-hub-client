'use client';
// *********** START OF IMPORTS ***********
import Link from 'next/link';

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
        <a className="flex items-center justify-center">
            Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </Link>
    </footer>
  );
}

// *********** END OF COMPONENT ***********

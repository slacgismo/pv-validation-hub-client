import Link from 'next/link';

/**
 *
 * @param {string} url a url to insert into the link
 * @return {JSX.Element} prefilled Link Component
 */
export default function Elink(url: {url: string}) {
  return (
    <Link
      href={`/external?exturl=${url.url}`}
      className='
    standardLink
    whitespace-nowrap
    '>
      {url.url}
    </Link>
  );
}

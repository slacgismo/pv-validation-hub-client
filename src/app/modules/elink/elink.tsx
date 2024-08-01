import Link from 'next/link';

/**
 *
 * @param {string} props.url a url to insert into the link
 * @param {string} props.linkText optional text to display in the link
 * @return {JSX.Element} prefilled Link Component
 */
export default function Elink(
    {url, linkText}: {url: string, linkText?: string}) {
  const text = linkText || url;
  return (
    <Link
      href={`/external?exturl=${url}`}
      className='
    standardLink
    whitespace-nowrap
    '>
      {text}
    </Link>
  );
}

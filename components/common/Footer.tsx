import dayjs from 'dayjs';
import Link from 'next/link';
// import { AiOutlineTwitter } from 'react-icons/ai';
// import { SiDiscord } from 'react-icons/si';

/* This example requires Tailwind CSS v2.0+ */
const navigation = {
  main: [
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'Partners', href: '#' },
  ],
  social: [
    // {
    //   name: 'Twitter',
    //   href: 'https://twitter.com/TournamentsWTF',
    //   icon: <AiOutlineTwitter size="1.4em" />,
    // },
    // {
    //   name: 'Discord',
    //   href: 'https://discord.gg/KEWBVvGRJs',
    //   icon: <SiDiscord size="1.4em" />,
    // },
  ],
};

export default function Footer() {
  return (
    <footer className="text-gray">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link href={item.href}>
                <a className="text-base text-gray hover:text-gray-900">
                  {item.name}
                </a>
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray hover:text-gray-400"
            >
              <span className="sr-only">{item.name}</span>
              <span>{item.icon}</span>
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-base">
          &copy; {dayjs().format('YYYY')} Project T, All rights reserved.
        </p>
      </div>
    </footer>
  );
}

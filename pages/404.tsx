import { Layout } from '@components/common';
import Link from 'next/link';

/* This example requires Tailwind CSS v2.0+ */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">
              404 error
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
              Page not found.
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-6">
              <Link href="/">
                <a className="text-base font-medium text-sky-600 hover:text-sky-500">
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <nav className="flex justify-center space-x-4">
          <Link href="/support">
            <a className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-400">
              Contact Support
            </a>
          </Link>
          <span
            className="inline-block border-l border-gray-300 dark:border-gray-400"
            aria-hidden="true"
          />
          <Link href="https://twitter.com/natelook">
            <a className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-400">
              Twitter
            </a>
          </Link>
        </nav>
      </footer>
    </div>
  );
}

NotFound.Layout = Layout;

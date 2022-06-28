/* This example requires Tailwind CSS v2.0+ */
import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BannerProps {
  message: string;
  color?: 'primary' | 'danger' | 'success';
  icon: JSX.Element;
  actionText?: string;
  actionLink?: string;
}

export default function Banner({
  message,
  color,
  icon,
  actionText,
  actionLink,
}: BannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div
          className={classNames('p-2 rounded-lg shadow-lg sm:p-3', {
            'bg-primary': color === 'primary',
            'bg-danger': color === 'danger',
            'bg-success': color === 'success',
          })}
        >
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              {icon && (
                <span
                  className={classNames('flex p-2 rounded-lg', {
                    'bg-primary-lighter': color === 'primary',
                    'bg-danger': color === 'danger',
                    'hover:bg-success': color === 'success',
                  })}
                >
                  <div className="h-6 w-6 text-white" aria-hidden="true">
                    {icon}
                  </div>
                </span>
              )}
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">We announced a new product!</span>
                <span className="hidden md:inline">{message}</span>
              </p>
            </div>
            {actionText && actionLink && (
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <Link href={actionLink}>
                  <a className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-600 bg-white hover:bg-sky-50">
                    {actionText}
                  </a>
                </Link>
              </div>
            )}
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                className={classNames(
                  '-mr-1 flex p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-white',
                  {
                    'hover:bg-primary-lighter': color === 'primary',
                    'hover:bg-red-600': color === 'danger',
                    'hover:bg-success': color === 'success',
                  },
                )}
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

Banner.defaultProps = {
  color: 'sky',
  actionText: null,
  actionLink: null,
};

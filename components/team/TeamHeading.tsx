interface TeamHeadingProps {
  name: string;
  subtitle?: string;
  isOwner?: boolean;
  secondaryButtonText?: string;
  primaryButtonText?: string;
  primaryButton?: () => void;
  secondaryButton?: () => void;
}

export default function TeamHeading({
  name,
  subtitle,
  isOwner,
  secondaryButtonText,
  primaryButtonText,
  primaryButton,
  secondaryButton,
}: TeamHeadingProps) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-10">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
          {name}
        </h2>
        {subtitle && <h3 className="text-gray-600">{subtitle}</h3>}
      </div>
      {isOwner && (
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {secondaryButtonText && (
            <button
              type="button"
              onClick={secondaryButton}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {secondaryButtonText}
            </button>
          )}

          {primaryButtonText && (
            <button
              type="button"
              onClick={primaryButton}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {primaryButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

TeamHeading.defaultProps = {
  primaryButton: null,
  secondaryButton: null,
  isOwner: null,
  subtitle: null,
  secondaryButtonText: null,
  primaryButtonText: null,
};

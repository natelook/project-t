/* This example requires Tailwind CSS v2.0+ */
const stats = [
  { name: 'Wins', stat: '324' },
  { name: 'Win Rate', stat: '58%' },
  { name: 'Tournament Wins', stat: '2' },
  { name: 'Prize Money', stat: '$21,500' },
];

export default function TeamStats() {
  return (
    <div>
      <h3 className="text-3xl leading-6 font-bold">Team Stats</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

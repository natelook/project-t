/* This example requires Tailwind CSS v2.0+ */
interface StatProps {
  stats: { name: string; stat: string }[];
}

export default function TeamStats({ stats }: StatProps) {
  return (
    <div>
      <h3 className="text-3xl leading-6 font-bold">Team Stats</h3>
      <dl className="mt-5 flex flex-col space-y-8">
        {stats.map((item) => (
          <div key={item.name} className="card">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-white">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

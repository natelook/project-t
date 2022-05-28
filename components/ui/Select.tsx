import { ChangeEvent } from 'react';

interface SelectProps {
  options: { value: number | string; name: string }[];
  label: string;
  id: string;
  defaultValue?: string | number;
  onChange: (value: string) => void;
}
export default function Select({
  options,
  label,
  id,
  defaultValue,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label
        htmlFor={`${id}`}
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        {label}
      </label>
      <select
        id={`${id}`}
        name="location"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:text-gray-900"
        defaultValue={defaultValue}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          console.log(e.target.value);
          onChange(e.target.value);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

Select.defaultProps = {
  defaultValue: null,
};

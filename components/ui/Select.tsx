import { FormValues } from '@lib/types';
import { ChangeEvent } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface SelectProps {
  options: { value?: number | string; name: string }[];
  label?: string;
  id: string;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  name?: any;
  register?: UseFormRegister<FormValues>;
}
export default function Select({
  options,
  label,
  id,
  defaultValue,
  onChange,
  name,
  register,
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={`${id}`} className="block text-sm font-medium">
          {label}
        </label>
      )}
      {register ? (
        <select
          id={`${id}`}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black"
          /* eslint-disable-next-line */
          {...register(name)}
        >
          {options.map((option) => (
            <option
              key={option.name}
              value={option.value ? option.value : option.name}
            >
              {option.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          id={`${id}`}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black"
          defaultValue={defaultValue}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            onChange(e.target.value);
          }}
        >
          {options.map((option) => (
            <option
              key={option.name}
              value={option.value ? option.value : option.name}
            >
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

Select.defaultProps = {
  defaultValue: null,
  label: undefined,
  name: null,
  register: null,
  onChange: null,
};

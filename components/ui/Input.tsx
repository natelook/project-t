import { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string | 'text';
}

export default function Input({
  name,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
      </div>
    </div>
  );
}

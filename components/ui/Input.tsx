import { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: string;
  hideLabel?: boolean;
}

export default function Input({
  name,
  id,
  value,
  onChange,
  label,
  type,
  hideLabel,
}: InputProps) {
  return (
    <div className="w-full">
      {!hideLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 capitalize"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          aria-label={label}
          type={type}
          name={name}
          id={id}
          value={value}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={`${label}...`}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
      </div>
    </div>
  );
}

Input.defaultProps = {
  type: 'text',
  hideLabel: false,
};

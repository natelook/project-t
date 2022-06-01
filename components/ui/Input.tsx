import { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: string;
  hideLabel?: boolean;
}

export default function Input({
  name,
  value,
  onChange,
  label,
  type,
  hideLabel,
}: InputProps) {
  const id = `${name}-input`;
  return (
    <div className="w-full">
      {!hideLabel && (
        <label htmlFor={id} className="label">
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
          className="input dark:text-black"
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

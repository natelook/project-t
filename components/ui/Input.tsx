import { FormValues } from '@lib/types';
import { ChangeEvent } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputProps {
  name: any;
  value?: string;
  onChange?: (value: string) => void;
  label: string;
  type?: string;
  hideLabel?: boolean;
  register?: UseFormRegister<FormValues>;
}

export default function Input({
  name,
  value,
  onChange,
  label,
  type,
  hideLabel,
  register,
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
        {register ? (
          <input
            /* eslint-disable-next-line */
            {...register(name)}
            aria-label={label}
            type={type}
            name={name}
            id={id}
            className="input"
            placeholder={`${label}...`}
          />
        ) : (
          <input
            aria-label={label}
            type={type}
            name={name}
            id={id}
            value={value}
            className="input"
            placeholder={`${label}...`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
          />
        )}
      </div>
    </div>
  );
}

Input.defaultProps = {
  type: 'text',
  hideLabel: false,
  register: null,
  onChange: null,
  value: null,
};

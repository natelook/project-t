import React, { MutableRefObject } from 'react';
import classnames from 'classnames';

interface ButtonProps {
  type?: 'button' | 'submit';
  style?: 'primary' | 'secondary';
  label: string;
  children: React.ReactNode;
  icon?: JSX.Element;
  size?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
  ref?: MutableRefObject<HTMLButtonElement | null>;
  onClick?: () => void;
}

export default function Button({
  type,
  style,
  label,
  children,
  icon,
  size,
  ref,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={classnames([
        style === 'secondary' ? 'btn-secondary' : 'btn',
        size,
        'w-full flex justify-center h-full',
      ])}
      aria-label={label}
      type={type === 'button' ? 'button' : 'submit'}
      onClick={onClick}
      ref={ref}
    >
      <span className="whitespace-nowrap">{children}</span>
      {icon && (
        <span className="ml-2 -mr-1 h-5 w-5" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  style: 'primary',
  size: 'text-base',
  icon: undefined,
  ref: null,
  onClick: undefined,
};

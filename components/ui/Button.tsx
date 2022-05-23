import React from 'react';
import classnames from 'classnames';

interface ButtonProps {
  type?: 'button' | 'submit';
  style?: 'primary' | 'secondary';
  label: string;
  children: React.ReactNode;
  icon?: JSX.Element;
  onClick: () => void;
}

export default function Button({
  type,
  style,
  label,
  children,
  icon,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={classnames(style === 'secondary' ? 'btn-secondary' : 'btn')}
      aria-label={label}
      type={type === 'button' ? 'button' : 'submit'}
      onClick={() => onClick()}
    >
      <span>{children}</span>
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
  icon: undefined,
};

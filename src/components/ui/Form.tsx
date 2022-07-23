import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormProps {
  methods: UseFormReturn<any>;
  children: JSX.Element;
  onSubmit: (values: any) => void;
}

export default function Form({ methods, children, onSubmit }: FormProps) {
  const { handleSubmit } = methods;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) =>
        child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                key: child.props.name,
              },
            })
          : child,
      )}
    </form>
  );
}

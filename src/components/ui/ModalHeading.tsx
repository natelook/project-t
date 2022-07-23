import { ReactNode } from 'react';

interface ModalHeadingProps {
  icon: ReactNode;
  title: string;
  subtext: string;
}

const ModalHeading = ({ icon, title, subtext }: ModalHeadingProps) => (
  <div className="mb-4">
    <div className="w-12 h-12 mx-auto">{icon}</div>
    <h3 className="text-2xl font-bold text-center">{title}</h3>
    {subtext && <p className="px-2 text-center text-sm">{subtext}</p>}
  </div>
);

export default ModalHeading;

// src/components/ui/label.tsx
import React, { FC, ReactNode } from "react";

interface LabelProps {
  htmlFor?: string; // atribut for untuk form input
  children: ReactNode;
  className?: string; // optional styling tambahan
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className || ""}`}
    >
      {children}
    </label>
  );
};

export default Label;

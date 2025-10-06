"use client";

import React, { ReactNode, FC, useState } from "react";

// ===== Accordion Utama =====
interface AccordionProps {
  children: ReactNode;
  className?: string;
  type?: "single" | "multiple"; // single: hanya 1 terbuka, multiple: bisa banyak
  collapsible?: boolean; // true: bisa ditutup
}

export const Accordion: FC<AccordionProps> = ({
  children,
  className,
  type = "single",
  collapsible = true,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === "single") {
      if (openItems.includes(value)) {
        if (collapsible) setOpenItems([]);
      } else {
        setOpenItems([value]);
      }
    } else {
      if (openItems.includes(value)) {
        setOpenItems(openItems.filter((v) => v !== value));
      } else {
        setOpenItems([...openItems, value]);
      }
    }
  };

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { openItems, toggleItem });
    }
    return child;
  });

  return <div className={className}>{enhancedChildren}</div>;
};

// ===== Item Accordion =====
interface AccordionItemProps {
  children: ReactNode;
  value: string;
  className?: string;
  openItems?: string[];
  toggleItem?: (value: string) => void;
}

export const AccordionItem: FC<AccordionItemProps> = ({
  children,
  value,
  className,
  openItems,
  toggleItem,
}) => {
  const isOpen = openItems?.includes(value) ?? false;

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, value, toggleItem });
        }
        return child;
      })}
    </div>
  );
};

// ===== Trigger Accordion =====
interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
  value?: string;
  toggleItem?: (value: string) => void;
}

export const AccordionTrigger: FC<AccordionTriggerProps> = ({
  children,
  className,
  value,
  toggleItem,
}) => {
  const handleClick = () => {
    if (toggleItem && value) toggleItem(value);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

// ===== Konten Accordion =====
interface AccordionContentProps {
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
}

export const AccordionContent: FC<AccordionContentProps> = ({
  children,
  className,
  isOpen,
}) => {
  return isOpen ? <div className={className}>{children}</div> : null;
};

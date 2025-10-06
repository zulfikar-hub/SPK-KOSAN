import React, { FC, HTMLAttributes, ReactNode } from "react";

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Wrapper */
export const DropdownMenu: FC<DropdownMenuProps> = ({ children, className = "", ...props }) => (
  <div className={`relative inline-block text-left ${className}`} {...props}>
    {children}
  </div>
);

/** Trigger (asChild optional) */
export const DropdownMenuTrigger: FC<{ asChild?: boolean; children: ReactNode } & HTMLAttributes<HTMLElement>> = ({
  children,
  
}) => <>{children}</>;

/** Content (alignment + props spread) */
export const DropdownMenuContent: FC<DropdownMenuProps & { align?: "start" | "end" }> = ({
  children,
  className = "",
  align = "start",
  ...props
}) => (
  <div
    className={`absolute mt-2 w-56 rounded-md shadow-lg bg-white ${align === "end" ? "right-0" : "left-0"} ${className}`}
    {...props}
  >
    {children}
  </div>
);

/** Item */
export const DropdownMenuItem: FC<DropdownMenuProps> = ({ children, className = "", ...props }) => (
  <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`} {...props}>
    {children}
  </div>
);

/** Label */
export const DropdownMenuLabel: FC<DropdownMenuProps> = ({ children, className = "", ...props }) => (
  <div className={`px-4 py-2 text-sm font-semibold text-gray-500 ${className}`} {...props}>
    {children}
  </div>
);

/** Separator — sekarang menerima className & props */
export const DropdownMenuSeparator: FC<DropdownMenuProps> = ({ className = "", ...props }) => (
  <div className={`border-t border-gray-200 my-1 ${className}`} {...props} />
);

import React, { HTMLAttributes, ReactNode } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: "default" | "secondary" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className, ...props }) => {
  let style = "px-2 py-1 rounded-full text-xs font-semibold"

  switch (variant) {
    case "secondary":
      style += " bg-gray-200 text-gray-800"
      break
    case "outline":
      style += " border border-gray-300 text-gray-800"
      break
    default:
      style += " bg-blue-500 text-white"
  }

  return (
    <span className={`${style} ${className}`} {...props}>
      {children}
    </span>
  )
}

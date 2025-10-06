import React, { InputHTMLAttributes, FC } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input: FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
)

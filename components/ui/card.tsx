import React, { HTMLAttributes, ReactNode } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`p-4 rounded-md bg-white shadow ${className}`} {...props}>
    {children}
  </div>
)

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`mb-2 ${className}`} {...props}>{children}</div>
)

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`${className}`} {...props}>{children}</div>
)

export const CardTitle: React.FC<CardProps> = ({ children, className, ...props }) => (
  <h3 className={`font-semibold text-lg ${className}`} {...props}>{children}</h3>
)

export const CardDescription: React.FC<CardProps> = ({ children, className, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>{children}</p>
)

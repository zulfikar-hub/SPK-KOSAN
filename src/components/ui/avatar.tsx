import React, { HTMLAttributes, ReactNode } from "react"

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ children, className, ...props }) => (
  <div className={`rounded-full overflow-hidden ${className}`} {...props}>
    {children}
  </div>
)

import Image from "next/image"
import { FC } from "react"

interface AvatarImageProps {
  src: string
  alt?: string
  className?: string
}

export const AvatarImage: FC<AvatarImageProps> = ({ src, alt = "", className = "" }) => (
  <div className={`relative w-full h-full ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "cover" }}
    />
  </div>
)


export const AvatarFallback: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 ${className}`}>{children}</div>
)

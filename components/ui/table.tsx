import React, { FC, HTMLAttributes, ReactNode, TableHTMLAttributes } from "react"

interface TableCommonProps {
  children: ReactNode
  className?: string
}

// <table>
export const Table: FC<TableCommonProps & TableHTMLAttributes<HTMLTableElement>> = ({ children, className = "", ...props }) => (
  <table className={`min-w-full border-collapse ${className}`} {...props}>
    {children}
  </table>
)

// <thead>
export const TableHeader: FC<TableCommonProps & HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = "", ...props }) => (
  <thead className={className} {...props}>
    {children}
  </thead>
)

// <tbody>
export const TableBody: FC<TableCommonProps & HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = "", ...props }) => (
  <tbody className={className} {...props}>
    {children}
  </tbody>
)

// <tr>
export const TableRow: FC<TableCommonProps & HTMLAttributes<HTMLTableRowElement>> = ({ children, className = "", ...props }) => (
  <tr className={className} {...props}>
    {children}
  </tr>
)

// <th>
export const TableHead: FC<TableCommonProps & HTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => (
  <th className={`text-left px-4 py-2 ${className}`} {...props}>
    {children}
  </th>
)

// <td>
export const TableCell: FC<TableCommonProps & HTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => (
  <td className={`px-4 py-2 ${className}`} {...props}>
    {children}
  </td>
)

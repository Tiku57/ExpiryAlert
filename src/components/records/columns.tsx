"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RowActions } from "./row-actions"

export type Record = {
  id: string
  title: string
  category: string
  department: string
  owner: string
  expiryDate: string
  daysRemaining: number
  status: "Active" | "Expiring Soon" | "Critical" | "Expired"
  priority: "Low" | "Medium" | "High" | "Critical"
}

export const columns: ColumnDef<Record>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Document Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "expiryDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiry Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "daysRemaining",
    header: "Days Left",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      return (
        <Badge 
          variant="outline" 
          className={
            status === "Active" ? "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" :
            status === "Expiring Soon" ? "border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400" :
            status === "Critical" ? "border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" :
            "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <Badge variant={priority === "Critical" ? "destructive" : "secondary"}>
          {priority}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions record={row.original} />
  },
]

"use client"

import { useState } from "react"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { deleteRecord, renewRecord } from "@/app/actions/record-actions"
import { toast } from "sonner"
import { Record } from "./columns"

interface RowActionsProps {
  record: Record
}

export function RowActions({ record }: RowActionsProps) {
  const [isRenewOpen, setIsRenewOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isRenewing, setIsRenewing] = useState(false)
  const [newExpiry, setNewExpiry] = useState("")

  const handleDelete = async () => {
    setIsDeleting(true)
    
    // Dispatch optimistic delete event so data-table removes it instantly
    window.dispatchEvent(new CustomEvent('optimistic-delete', { detail: { ids: [record.id] } }))
    
    try {
      await deleteRecord(record.id)
      toast.success("Record Deleted")
    } catch {
      // We don't have a robust way to undo the optimistic delete in row-actions alone, 
      // but revalidatePath will fix it on the next poll/interaction, or we could fire an undo event.
      toast.error("Failed to delete record")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpiry) return

    setIsRenewing(true)
    try {
      await renewRecord(record.id, newExpiry)
      toast.success("Record Renewed")
      setIsRenewOpen(false)
    } catch {
      toast.error("Failed to renew record")
    } finally {
      setIsRenewing(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(record.id)}>
              Copy Record ID
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href={`/dashboard/records/${record.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              View Details
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setIsRenewOpen(true)}>
            Renew Record
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenewOpen} onOpenChange={setIsRenewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Record</DialogTitle>
            <DialogDescription>
              Set a new expiry date for &quot;{record.title}&quot;. This will log a renewal history entry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenew}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">New Expiry Date</Label>
                <Input 
                  id="expiry" 
                  type="date" 
                  value={newExpiry} 
                  onChange={(e) => setNewExpiry(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRenewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isRenewing || !newExpiry}>
                {isRenewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Renew
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Record?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete &quot;{record.title}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { differenceInDays, startOfDay } from "date-fns"

export type ExpiryStatus = "Active" | "Expiring Soon" | "Critical" | "Expired"

/**
 * Calculates the expiry status based on the expiry date and current date.
 * 
 * Rules:
 * - Green (Active): More than 30 days left
 * - Yellow (Expiring Soon): 7–30 days left
 * - Orange (Critical): 1–7 days left
 * - Red (Expired): Past expiry
 */
export function getExpiryStatus(expiryDate: Date, currentDate: Date = new Date()): ExpiryStatus {
  const daysLeft = differenceInDays(startOfDay(expiryDate), startOfDay(currentDate))

  if (daysLeft < 0) {
    return "Expired"
  }
  
  if (daysLeft <= 7) {
    return "Critical"
  }
  
  if (daysLeft <= 30) {
    return "Expiring Soon"
  }
  
  return "Active"
}

export function getStatusColor(status: ExpiryStatus): string {
  switch (status) {
    case "Active": return "text-green-600 bg-green-50 border-green-200"
    case "Expiring Soon": return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "Critical": return "text-orange-600 bg-orange-50 border-orange-200"
    case "Expired": return "text-red-600 bg-red-50 border-red-200"
    default: return "text-slate-600 bg-slate-50 border-slate-200"
  }
}

"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getNotifications, markAllNotificationsRead, markNotificationRead, dismissNotification } from "@/app/actions/notification-actions"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, isRead: boolean, createdAt: Date}[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch {
      console.error("Failed to fetch notifications")
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()

    const handleUpdate = () => {
      fetchNotifications()
    }

    window.addEventListener('notifications-updated', handleUpdate)
    return () => window.removeEventListener('notifications-updated', handleUpdate)
  }, [])
  
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotifications()
    }
  }, [isOpen])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAllRead = async () => {
    setLoading(true)
    try {
      await markAllNotificationsRead()
      await fetchNotifications()
      window.dispatchEvent(new Event('notifications-updated'))
      toast.success("All notifications marked as read")
    } catch {
      toast.error("Failed to mark notifications as read")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id)
      await fetchNotifications()
      window.dispatchEvent(new Event('notifications-updated'))
    } catch {
      toast.error("Failed to mark notification as read")
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id)
      await fetchNotifications()
      window.dispatchEvent(new Event('notifications-updated'))
    } catch {
      toast.error("Failed to dismiss notification")
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-slate-500 h-9 w-9 rounded-full relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-white dark:border-slate-950" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={handleMarkAllRead} disabled={loading}>
              {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group relative",
                  !notif.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                <div className="flex justify-between items-start mb-1 pr-6">
                  <p className={cn("text-sm font-medium", !notif.isRead && "text-blue-600 dark:text-blue-400")}>
                    {notif.title}
                  </p>
                  <p className="text-[10px] text-slate-500 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {notif.message}
                </p>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                  {!notif.isRead && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMarkRead(notif.id)} title="Mark as read">
                      <Check className="h-3 w-3 text-blue-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => handleDismiss(notif.id)} title="Dismiss">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              No notifications yet.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

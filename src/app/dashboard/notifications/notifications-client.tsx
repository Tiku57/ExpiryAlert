"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bell, AlertTriangle, CheckCircle, Info, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/app/actions/notification-actions"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, isRead: boolean, createdAt: Date}[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
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

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAllRead = async () => {
    setActionLoading(true)
    try {
      await markAllNotificationsRead()
      await fetchNotifications()
      window.dispatchEvent(new Event('notifications-updated'))
      toast.success("All notifications marked as read")
    } catch {
      toast.error("Failed to mark notifications as read")
    } finally {
      setActionLoading(false)
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

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground text-slate-500">
            View all alerts, renewals, and system messages.
          </p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0 || actionLoading || loading}>
          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Mark all as read
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            {loading ? "Loading notifications..." : unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` : "🎉 You're all caught up! No unread notifications."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                // Determine icon based on message content since type doesn't exist on Prisma model directly in the same way
                const isCritical = notification.title?.toLowerCase().includes("critical") || notification.message?.toLowerCase().includes("expire") || notification.message?.toLowerCase().includes("overdue")
                const isSuccess = notification.message?.toLowerCase().includes("renew") || notification.message?.toLowerCase().includes("added") || notification.title?.toLowerCase().includes("success")
                
                return (
                  <div 
                    key={notification.id} 
                    onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border transition-colors relative group",
                      notification.isRead 
                        ? 'bg-transparent border-slate-100 dark:border-slate-800' 
                        : 'bg-slate-50 dark:bg-slate-900 border-primary/20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="mt-1">
                      {isCritical ? <AlertTriangle className="h-5 w-5 text-red-500" /> :
                       isSuccess ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                       <Info className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 space-y-1 pr-6">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm font-medium", !notification.isRead && "text-primary")}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-slate-500">{new Date(notification.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary group-hover:hidden"></div>
                        <Check className="h-4 w-4 text-primary hidden group-hover:block" />
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center p-12 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

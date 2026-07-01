import { NotificationsClient } from "./notifications-client"

export const metadata = {
  title: "Notifications | ExpiryAlert",
  description: "View your alerts and system messages",
}

export default function NotificationsPage() {
  return <NotificationsClient />
}

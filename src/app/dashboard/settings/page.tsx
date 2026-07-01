import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { SettingsContent } from "@/components/settings/settings-content"

export const dynamic = 'force-dynamic';

export default async function SettingsRoute() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true }
  })

  if (!user) return null

  return (
    <div className="flex-1 space-y-6 flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <SettingsContent user={user} />
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function RecentActivity() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return null
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.organizationId) return null

  const logs = await prisma.activityLog.findMany({
    where: { record: { organizationId: user.organizationId } },
    include: { record: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{log.action}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {log.details} {log.record ? <span>on <span className="font-semibold">{log.record.title}</span></span> : ''}
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-slate-500">
                {log.createdAt.toLocaleDateString()}
              </div>
            </div>
          )) : (
            <p className="text-sm text-slate-500">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { differenceInDays, startOfDay } from "date-fns"

export async function UpcomingDeadlines() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return null
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.organizationId) return null

  const upcomingRecords = await prisma.record.findMany({
    where: { 
      organizationId: user.organizationId,
      status: { in: ["Critical", "Expiring Soon", "Expired"] } 
    },
    orderBy: { expiryDate: 'asc' },
    take: 5
  })

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>
          Documents expiring in the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {upcomingRecords.length > 0 ? upcomingRecords.map((record) => {
            const daysRemaining = differenceInDays(startOfDay(new Date(record.expiryDate)), startOfDay(new Date()))
            return (
              <div key={record.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{record.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Expires on {new Date(record.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {daysRemaining < 0 
                      ? `${Math.abs(daysRemaining)} days ago`
                      : `${daysRemaining} days left`
                    }
                  </span>
                  <Badge 
                    variant="outline" 
                    className={
                      record.status === "Critical" ? "border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" :
                      record.status === "Expired" ? "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400" :
                      "border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              </div>
            )
          }) : (
            <p className="text-sm text-slate-500">No upcoming deadlines.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

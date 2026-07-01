import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarIcon, Download, History, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { differenceInDays, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function RecordDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  if (!user?.organizationId) return null

  const record = await prisma.record.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: {
      category: true,
      department: true,
      owner: true,
      attachments: true,
      activityLogs: {
        orderBy: { createdAt: 'desc' }
      },
      renewalHistory: {
        orderBy: { renewedAt: 'desc' }
      }
    }
  })

  if (!record) return notFound()

  const expiryDate = new Date(record.expiryDate)
  const daysRemaining = differenceInDays(startOfDay(new Date(record.expiryDate)), startOfDay(new Date()))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{record.title}</h2>
            <Badge 
              variant="outline" 
              className={
                record.status === "Active" ? "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" :
                record.status === "Expiring Soon" ? "border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400" :
                record.status === "Critical" ? "border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" :
                "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
              }
            >
              {record.status}
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
            <span>{record.category?.name || "Uncategorized"}</span> • <span>{record.department?.name || "Unassigned"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {/* Action buttons can be converted to Client components later, or just Link for edit */}
          <Link href={`/dashboard/records`}>
            <Button variant="outline" size="sm">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Owner</p>
                  <p className="font-semibold">{record.owner?.name || "No Owner"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Priority</p>
                  <p className="font-semibold">{record.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Created On</p>
                  <p className="font-semibold">{record.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Last Updated</p>
                  <p className="font-semibold">{record.updatedAt.toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500 font-medium mb-1">Notes</p>
                  <p className="text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    {record.notes || "No notes available for this record."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                {record.activityLogs.length > 0 ? (
                  record.activityLogs.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white dark:ring-slate-950" />
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-slate-500">{log.createdAt.toLocaleDateString()} - {log.details}</p>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white dark:ring-slate-950" />
                    <p className="text-sm font-medium">Record Created</p>
                    <p className="text-xs text-slate-500">{record.createdAt.toLocaleDateString()} by System</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={daysRemaining < 30 ? "border-orange-200 dark:border-orange-900" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">Expiry Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{expiryDate.toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500">{daysRemaining} days remaining</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4">
                <div 
                  className={cn("h-2 rounded-full", daysRemaining < 30 ? "bg-red-500" : daysRemaining < 90 ? "bg-yellow-500" : "bg-green-500")}
                  style={{ width: `${Math.max(0, Math.min(100, (daysRemaining / 365) * 100))}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
              <CardDescription>Associated files and documents</CardDescription>
            </CardHeader>
            <CardContent>
              {record.attachments.length > 0 ? (
                <div className="space-y-3">
                  {record.attachments.map(att => (
                    <a key={att.id} href={att.fileUrl} download={att.fileName} target="_blank" rel="noopener noreferrer">
                      <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer mb-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{att.fileName}</p>
                            {att.fileSize && (
                              <p className="text-xs text-slate-500">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-slate-500" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No attachments</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

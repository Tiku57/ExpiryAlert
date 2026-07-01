import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function StatCards() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return null
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.organizationId) return null

  const orgId = user.organizationId
  
  const total = await prisma.record.count({ where: { organizationId: orgId } })
  const active = await prisma.record.count({ where: { organizationId: orgId, status: "Active" } })
  const expiring = await prisma.record.count({ where: { organizationId: orgId, status: "Expiring Soon" } })
  const expired = await prisma.record.count({ where: { organizationId: orgId, status: { in: ["Expired", "Critical"] } } })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <FileText className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active & Healthy</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-500">{active}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">{expiring}</div>
          <p className="text-xs text-slate-500">Within next 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired / Critical</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-500">{expired}</div>
          <p className="text-xs text-red-500 font-medium">Requires immediate action</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { columns } from "@/components/records/columns"
import { DataTable } from "@/components/records/data-table"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic';

async function getData() {
  const session = await auth()
  if (!session?.user?.id) return []

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  if (!user?.organizationId) return []

  const records = await prisma.record.findMany({
    where: { organizationId: user.organizationId },
    include: {
      category: true,
      department: true,
      owner: true,
    },
    orderBy: { expiryDate: 'asc' }
  })

  return records.map(r => {
    const expiry = new Date(r.expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      id: r.id,
      title: r.title,
      category: r.category?.name || "Uncategorized",
      department: r.department?.name || "Unassigned",
      owner: r.owner?.name || "No Owner",
      expiryDate: expiry.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),
      daysRemaining,
      status: r.status as "Active" | "Expiring Soon" | "Expired" | "Critical",
      priority: r.priority as "Low" | "Medium" | "High",
    }
  })
}

export default async function RecordsPage() {
  const data = await getData()

  return (
    <div className="flex-1 space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Records</h2>
      </div>
      
      <div className="flex-1 rounded-xl bg-white dark:bg-slate-950/50 flex flex-col overflow-hidden">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

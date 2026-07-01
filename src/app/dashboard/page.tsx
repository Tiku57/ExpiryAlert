import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  if (!user?.organizationId) return null

  const records = await prisma.record.findMany({
    where: { organizationId: user.organizationId },
    include: { category: true }
  })

  // Calculate category distribution
  const categoryCount: Record<string, number> = {}
  records.forEach(r => {
    const catName = r.category?.name || "Uncategorized"
    categoryCount[catName] = (categoryCount[catName] || 0) + 1
  })
  const categoryData = Object.entries(categoryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Calculate expiry trend (next 6 months)
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const expiryCountByMonth: Record<string, { total: number, active: number, expiringSoon: number, critical: number, expired: number }> = {}
  for (let i = 0; i < 6; i++) {
    const d = new Date(currentYear, currentMonth + i, 1)
    expiryCountByMonth[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = {
      total: 0, active: 0, expiringSoon: 0, critical: 0, expired: 0
    }
  }

  records.forEach(r => {
    const expDate = new Date(r.expiryDate)
    const key = `${monthNames[expDate.getMonth()]} ${expDate.getFullYear()}`
    
    // Only map if it falls within our 6-month window or if we want to show past months,
    // but the original logic only pre-filled the next 6 months.
    if (expiryCountByMonth[key]) {
      expiryCountByMonth[key].total++
      
      switch(r.status) {
        case "Active": 
          expiryCountByMonth[key].active++
          break
        case "Expiring Soon": 
          expiryCountByMonth[key].expiringSoon++
          break
        case "Critical": 
          expiryCountByMonth[key].critical++
          break
        case "Expired": 
          expiryCountByMonth[key].expired++
          break
      }
    }
  })

  const expiryData = Object.entries(expiryCountByMonth).map(([name, data]) => ({
    name: name.split(' ')[0], // Just use the month name
    ...data
  }))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <div className="flex items-center space-x-2">
        </div>
      </div>
      
      <StatCards />
      
      <OverviewCharts expiryData={expiryData} categoryData={categoryData} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <UpcomingDeadlines />
        <RecentActivity />
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface OverviewChartsProps {
  expiryData: { name: string; total: number; active: number; expiringSoon: number; critical: number; expired: number }[]
  categoryData: { name: string; value: number }[]
}

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899', '#14B8A6'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { payload: { total: number, active: number, expiringSoon: number, critical: number, expired: number } }[], label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#111827] text-slate-100 p-4 rounded-xl shadow-lg border border-slate-800 min-w-[160px] transition-all duration-200 animate-in fade-in zoom-in-95">
        <p className="font-semibold mb-3 border-b border-slate-700 pb-2 text-sm">{`Month: ${label}`}</p>
        <div className="space-y-1.5 text-sm">
          <p className="text-slate-300 flex justify-between gap-4"><span>Total Records:</span> <span className="font-bold text-white">{data.total}</span></p>
          {data.active > 0 && <p className="text-emerald-400 flex justify-between gap-4"><span>Active:</span> <span className="font-semibold">{data.active}</span></p>}
          {data.expiringSoon > 0 && <p className="text-amber-400 flex justify-between gap-4"><span>Expiring Soon:</span> <span className="font-semibold">{data.expiringSoon}</span></p>}
          {data.critical > 0 && <p className="text-orange-400 flex justify-between gap-4"><span>Critical:</span> <span className="font-semibold">{data.critical}</span></p>}
          {data.expired > 0 && <p className="text-rose-400 flex justify-between gap-4"><span>Expired:</span> <span className="font-semibold">{data.expired}</span></p>}
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewCharts({ expiryData, categoryData }: OverviewChartsProps) {
  const hasExpiryData = expiryData.some(d => d.total > 0);
  const hasCategoryData = categoryData.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Expiry Trend</CardTitle>
        </CardHeader>
        <CardContent className="pl-2 relative">
          {hasExpiryData ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={expiryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  tickMargin={12}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(100,116,139,0.1)' }} 
                  isAnimationActive={true}
                  animationDuration={200}
                />
                <Bar dataKey="active" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="expiringSoon" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="critical" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="expired" stackId="a" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] w-full flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="text-6xl mb-2">📄</div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">No expiry data available</h3>
                <p className="text-slate-500 text-sm max-w-sm">Create your first record to start seeing expiry trends.</p>
              </div>
              <Link href="/dashboard/records/new">
                <Button className="mt-4">Create Record</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCategoryData ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #1e293b', 
                      backgroundColor: '#111827',
                      color: '#f1f5f9',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.2)'
                    }} 
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm px-4">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[350px] w-full flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="text-6xl mb-2">📊</div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">No categories</h3>
                <p className="text-slate-500 text-sm max-w-sm">Add records with categories to see the breakdown.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function RecordsLoading() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[120px]" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[250px]" />
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}

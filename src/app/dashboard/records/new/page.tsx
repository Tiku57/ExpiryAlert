import { CreateRecordForm } from "@/components/records/create-record-form"

export default function NewRecordPage() {
  return (
    <div className="flex-1 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Record</h2>
          <p className="text-muted-foreground text-slate-500">
            Add a new document, contract, or certification to track its expiry.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-950/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CreateRecordForm />
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { EmploymentApplications } from "@/components/dashboard/employment-applications"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: applications } = await supabase
    .from("employment_applications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Employment Applications</h2>
        <p className="text-muted-foreground">Manage and track your job applications</p>
      </div>
      <EmploymentApplications initialApplications={applications || []} />
    </div>
  )
}

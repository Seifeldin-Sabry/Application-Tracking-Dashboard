import { createClient } from "@/lib/supabase/server"
import { EducationApplications } from "@/components/dashboard/education-applications"

export default async function EducationPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: applications } = await supabase
    .from("education_applications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Education Applications</h2>
        <p className="text-muted-foreground">Manage and track your education applications</p>
      </div>
      <EducationApplications initialApplications={applications || []} />
    </div>
  )
}

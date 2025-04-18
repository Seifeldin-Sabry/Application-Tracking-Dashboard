import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/database.types"

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      case "interview":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
      case "offer":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: ApplicationStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Badge className={`${getStatusColor(status)} font-medium`} variant="outline">
      {getStatusLabel(status)}
    </Badge>
  )
}

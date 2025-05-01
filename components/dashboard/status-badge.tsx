import { Badge } from "@/components/ui/badge"
import type { EducationStatus, EmploymentStatus } from "@/lib/database.types"

interface StatusBadgeProps {
    status: EducationStatus | EmploymentStatus
}

export function StatusBadge({ status }: StatusBadgeProps ) {
  const getStatusColor = (status: EducationStatus | EmploymentStatus ) => {
    switch (status) {
      case "contacted":
          return "bg-yellow-500 text-yellow-800"
      case "applied":
        return "bg-blue-500 text-blue-800"
      case "accepted":
        return "bg-green-500 text-green-800"
      case "enrolled":
        return "bg-green-500 text-green-800"
      case "offer":
        return "bg-green-500 text-green-800"
      case "interviewing":
        return "bg-blue-500 text-blue-800"
      case "dismissed":
        return "bg-red-500 text-red-800"
      case "rejected":
        return "bg-red-500 text-red-800"
      case "noreply":
        return "bg-gray-500 text-gray-800"
      default:
        return "bg-gray-500 text-gray-800"
    }
  }

  const getStatusLabel = (status: EducationStatus | EmploymentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
  }

  return (
    <Badge className={`${getStatusColor(status)} font-medium`} variant="outline">
      {getStatusLabel(status)}
    </Badge>
  )
}

"use client"
import { Check, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ApplicationStatus } from "@/lib/database.types"

interface StatusFilterProps {
    selectedStatuses: ApplicationStatus[]
    onChange: (statuses: ApplicationStatus[]) => void
}

export function StatusFilter({ selectedStatuses, onChange }: StatusFilterProps) {
    const allStatuses: ApplicationStatus[] = ["applied", "interview", "offer", "accepted", "rejected", "withdrawn"]

    const isAllSelected = selectedStatuses.length === allStatuses.length
    const isAnySelected = selectedStatuses.length > 0

    const handleSelectAll = () => {
        onChange(isAllSelected ? [] : [...allStatuses])
    }

    const handleStatusChange = (status: ApplicationStatus) => {
        if (selectedStatuses.includes(status)) {
            onChange(selectedStatuses.filter((s) => s !== status))
        } else {
            onChange([...selectedStatuses, status])
        }
    }

    const getStatusLabel = (status: ApplicationStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter Status</span>
                    {isAnySelected && (
                        <span className="ml-1 rounded-full bg-primary px-2 text-xs text-primary-foreground">
              {selectedStatuses.length}
            </span>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                >
                    Select All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {allStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                        key={status}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => handleStatusChange(status)}
                    >
                        {getStatusLabel(status)}
                    </DropdownMenuCheckboxItem>
                ))}
                {isAnySelected && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => onChange([])}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
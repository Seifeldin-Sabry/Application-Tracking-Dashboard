"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Tables, ApplicationStatus } from "@/lib/database.types"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { EducationApplicationDialog } from "@/components/dashboard/education-application-dialog"
import { StatusFilter } from "@/components/dashboard/status-filter"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ExternalLink, MoreHorizontal, Plus, Filter } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type EducationApplication = Tables<"education_applications">

interface EducationApplicationsProps {
    initialApplications: EducationApplication[]
}

export function EducationApplications({ initialApplications }: EducationApplicationsProps) {
    const [applications, setApplications] = useState<EducationApplication[]>(initialApplications)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentApplication, setCurrentApplication] = useState<EducationApplication | null>(null)
    const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>([])
    const [institutionFilter, setInstitutionFilter] = useState("")
    const router = useRouter()
    const supabase = createClient()

    const handleAddApplication = async (
        application: Omit<EducationApplication, "id" | "user_id" | "created_at" | "updated_at">,
    ) => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        toast.promise(
            supabase
                .from("education_applications")
                .insert({
                    ...application,
                    user_id: user.id,
                })
                .select()
                .single()
                .then(({ data, error }) => {
                    if (error) throw error
                    setApplications([data, ...applications])
                    router.refresh()
                    return data
                }),
            {
                loading: "Adding application...",
                success: "Application added successfully!",
                error: "Failed to add application",
            },
        )
    }

    const handleUpdateApplication = async (id: string, application: Partial<EducationApplication>) => {
        toast.promise(
            supabase
                .from("education_applications")
                .update(application)
                .eq("id", id)
                .select()
                .single()
                .then(({ data, error }) => {
                    if (error) throw error
                    setApplications(applications.map((app) => (app.id === id ? data : app)))
                    router.refresh()
                    return data
                }),
            {
                loading: "Updating application...",
                success: "Application updated successfully!",
                error: "Failed to update application",
            },
        )
    }

    const handleDeleteApplication = async () => {
        if (!currentApplication) return

        toast.promise(
            supabase
                .from("education_applications")
                .delete()
                .eq("id", currentApplication.id)
                .then(({ error }) => {
                    if (error) throw error
                    setApplications(applications.filter((app) => app.id !== currentApplication.id))
                    setIsDeleteDialogOpen(false)
                    setCurrentApplication(null)
                    router.refresh()
                }),
            {
                loading: "Deleting application...",
                success: "Application deleted successfully!",
                error: "Failed to delete application",
            },
        )
    }

    const filteredApplications = applications.filter((app) => {
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(app.status)
        const matchesInstitution =
            institutionFilter === "" || app.institution_name.toLowerCase().includes(institutionFilter.toLowerCase())
        return matchesStatus && matchesInstitution
    })

    const columns: ColumnDef<EducationApplication>[] = [
        {
            accessorKey: "institution_name",
            header: "Institution",
            cell: ({ row }) => <div className="font-medium">{row.getValue("institution_name")}</div>,
        },
        {
            accessorKey: "degree_name",
            header: "Degree",
        },
        {
            accessorKey: "program_link",
            header: "Program Link",
            cell: ({ row }) => {
                const link = row.getValue("program_link") as string | null
                return link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline"
                    >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View
                    </a>
                ) : (
                    <span className="text-muted-foreground">No link</span>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as ApplicationStatus
                return <StatusBadge status={status} />
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const application = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    setCurrentApplication(application)
                                    setIsDialogOpen(true)
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                    setCurrentApplication(application)
                                    setIsDeleteDialogOpen(true)
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h3 className="text-lg font-medium">Your Applications</h3>
                <Button
                    onClick={() => {
                        setCurrentApplication(null)
                        setIsDialogOpen(true)
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Applications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 ">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <StatusFilter selectedStatuses={selectedStatuses} onChange={setSelectedStatuses} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="institution-filter" className="text-sm font-medium">
                                Institution Name
                            </label>
                            <Input
                                id="institution-filter"
                                placeholder="Filter by institution name"
                                value={institutionFilter}
                                onChange={(e) => setInstitutionFilter(e.target.value)}
                            />
                            {institutionFilter && (
                                <Button variant="outline" size="sm" onClick={() => setInstitutionFilter("")}
                                        className="mt-2"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                    {(selectedStatuses.length > 0 || institutionFilter) && (
                        <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredApplications.length} of {applications.length} applications
              </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedStatuses([])
                                    setInstitutionFilter("")
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DataTable
                columns={columns}
                data={filteredApplications}
                searchColumn="institution_name"
                searchPlaceholder="Search institutions..."
            />

            <EducationApplicationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                application={currentApplication}
                onSubmit={(data) => {
                    if (currentApplication) {
                        handleUpdateApplication(currentApplication.id, data)
                    } else {
                        handleAddApplication(data)
                    }
                    setIsDialogOpen(false)
                }}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this application. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteApplication} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

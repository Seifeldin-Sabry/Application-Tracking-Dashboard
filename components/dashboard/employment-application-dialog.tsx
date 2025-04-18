"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Tables, EmploymentStatus } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employmentStatus } from "@/lib/database.types"
import { useIsMobile } from "@/hooks/use-mobile"

type EmploymentApplication = Tables<"employment_applications">

const formSchema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    job_title: z.string().min(1, "Job title is required"),
    job_posting_link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
    status: z.enum(employmentStatus),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EmploymentApplicationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    application: EmploymentApplication | null
    onSubmit: (values: FormValues) => void
}

export function EmploymentApplicationDialog({
                                                open,
                                                onOpenChange,
                                                application,
                                                onSubmit,
                                            }: EmploymentApplicationDialogProps) {
    const isMobile = useIsMobile()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: "",
            job_title: "",
            job_posting_link: "",
            status: "applied" as EmploymentStatus,
            notes: "",
        },
    })

    // Reset form when opening for new application
    useEffect(() => {
        if (open && !application) {
            form.reset({
                company_name: "",
                job_title: "",
                job_posting_link: "",
                status: "applied",
                notes: "",
            })
        }
    }, [open, application, form])

    // Populate form when editing existing application
    useEffect(() => {
        if (application) {
            form.reset({
                company_name: application.company_name,
                job_title: application.job_title,
                job_posting_link: application.job_posting_link || "",
                status: application.status,
                notes: application.notes || "",
            })
        }
    }, [application, form])

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
        if (!application) {
            form.reset({
                company_name: "",
                job_title: "",
                job_posting_link: "",
                status: "applied",
                notes: "",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${isMobile ? 'w-full max-w-full rounded-none h-[95vh]' : 'sm:max-w-[500px]'} flex flex-col`}>
                <DialogHeader>
                    <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
                    <DialogDescription>
                        {application
                            ? "Update the details of your job application."
                            : "Enter the details of your new job application."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="company_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter company name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="job_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter job title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="job_posting_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Posting Link (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {employmentStatus.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add any additional notes about this application"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''} mt-4`}>
                    {isMobile && (
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full">Cancel</Button>
                        </DialogClose>
                    )}
                    <Button type="submit" className={isMobile ? "w-full" : ""} onClick={form.handleSubmit(handleSubmit)}>
                        {application ? "Update Application" : "Add Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
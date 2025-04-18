"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Tables, EducationStatus } from "@/lib/database.types"
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
import { educationStatus } from "@/lib/database.types"
import { useIsMobile } from "@/hooks/use-mobile"

type EducationApplication = Tables<"education_applications">

const formSchema = z.object({
    institution_name: z.string().min(1, "Institution name is required"),
    degree_name: z.string().min(1, "Degree name is required"),
    program_link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
    location: z.string().optional(),
    tuition_fees: z.string().optional(),
    duration: z.string().optional(),
    application_deadline: z.date().optional(),
    status: z.enum(educationStatus),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EducationApplicationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    application: EducationApplication | null
    onSubmit: (values: FormValues) => void
}

export function EducationApplicationDialog({
                                               open,
                                               onOpenChange,
                                               application,
                                               onSubmit,
                                           }: EducationApplicationDialogProps) {
    const isMobile = useIsMobile()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            institution_name: "",
            degree_name: "",
            program_link: "",
            location: "",
            tuition_fees: "",
            duration: "",
            application_deadline: undefined,
            status: "applied" as EducationStatus,
            notes: "",
        },
    })

    useEffect(() => {
        if (application) {
            form.reset({
                institution_name: application.institution_name,
                degree_name: application.degree_name,
                program_link: application.program_link || "",
                status: application.status,
                location: application.location || "",
                tuition_fees: application.tuition_fees || "",
                duration: application.duration || "",
                application_deadline: application.application_deadline ? new Date(application.application_deadline) : undefined,
                notes: application.notes || "",
            })
        } else {
            form.reset({
                institution_name: "",
                degree_name: "",
                program_link: "",
                location: "",
                tuition_fees: "",
                duration: "",
                application_deadline: undefined,
                status: "applied",
                notes: "",
            })
        }
    }, [application, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${isMobile ? 'w-full max-w-full rounded-none h-[95vh]' : 'sm:max-w-[500px]'} flex flex-col`}>
                <DialogHeader>
                    <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
                    <DialogDescription>
                        {application
                            ? "Update the details of your education application."
                            : "Enter the details of your new education application."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="institution_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter institution name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="degree_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Degree Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter degree name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="program_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Program Link (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tuition_fees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuition Fees (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter tuition fees" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter duration" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="application_deadline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application Deadline (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                                    field.onChange(date);
                                                }}
                                            />
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
                                                {educationStatus.map((status) => (
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
                    <Button type="submit" className={isMobile ? "w-full" : ""} onClick={form.handleSubmit(onSubmit)}>
                        {application ? "Update Application" : "Add Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
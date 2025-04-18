"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Tables, ApplicationStatus } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type EducationApplication = Tables<"education_applications">

const formSchema = z.object({
  institution_name: z.string().min(1, "Institution name is required"),
  degree_name: z.string().min(1, "Degree name is required"),
  program_link: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
  status: z.enum(["applied", "interview", "offer", "rejected", "accepted", "withdrawn"]),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution_name: "",
      degree_name: "",
      program_link: "",
      status: "applied" as ApplicationStatus,
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
        notes: application.notes || "",
      })
    } else {
      form.reset({
        institution_name: "",
        degree_name: "",
        program_link: "",
        status: "applied",
        notes: "",
      })
    }
  }, [application, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
          <DialogDescription>
            {application
              ? "Update the details of your education application."
              : "Enter the details of your new education application."}
          </DialogDescription>
        </DialogHeader>
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
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
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
            <DialogFooter>
              <Button type="submit">{application ? "Update Application" : "Add Application"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

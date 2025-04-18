export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      employment_applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_posting_link: string | null
          job_title: string
          status: ApplicationStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_posting_link?: string | null
          job_title: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_posting_link?: string | null
          job_title?: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      education_applications: {
        Row: {
          id: string
          user_id: string
          institution_name: string
          program_link: string | null
          degree_name: string
          status: ApplicationStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution_name: string
          program_link?: string | null
          degree_name: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution_name?: string
          program_link?: string | null
          degree_name?: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      application_status: ApplicationStatus
    }
  }
}

export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected" | "accepted" | "withdrawn"

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

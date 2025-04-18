export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  public: {
    Tables: {
      education_applications: {
        Row: {
          application_deadline: string | null
          created_at: string | null
          degree_name: string
          duration: string | null
          id: string
          institution_name: string
          location: string | null
          notes: string | null
          program_link: string | null
          status: Database["public"]["Enums"]["application_status"]
          tuition_fees: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string | null
          degree_name: string
          duration?: string | null
          id?: string
          institution_name: string
          location?: string | null
          notes?: string | null
          program_link?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tuition_fees?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string | null
          degree_name?: string
          duration?: string | null
          id?: string
          institution_name?: string
          location?: string | null
          notes?: string | null
          program_link?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tuition_fees?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      employment_applications: {
        Row: {
          company_name: string
          created_at: string | null
          id: string
          job_posting_link: string | null
          job_title: string
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          id?: string
          job_posting_link?: string | null
          job_title: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
          job_posting_link?: string | null
          job_title?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
          | "applied"
          | "interview"
          | "offer"
          | "rejected"
          | "accepted"
          | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
            | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof Database
        }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
              Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof Database
        }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
              Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
          schema: keyof Database
        }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
              Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
            | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
          schema: keyof Database
        }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
          schema: keyof Database
        }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "applied",
        "interview",
        "offer",
        "rejected",
        "accepted",
        "withdrawn",
      ],
    },
  },
} as const

export const ApplicationStatus = Constants.public.Enums.application_status

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

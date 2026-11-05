export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      application_details: {
        Row: {
          applicationId: string;
          cons: string | null;
          contactName: string | null;
          coverLetter: string | null;
          createdAt: string | null;
          id: string;
          jobPostingUrl: string | null;
          notes: string | null;
          pros: string | null;
          rejectionReason: string | null;
        };
        Insert: {
          applicationId: string;
          cons?: string | null;
          contactName?: string | null;
          coverLetter?: string | null;
          createdAt?: string | null;
          id?: string;
          jobPostingUrl?: string | null;
          notes?: string | null;
          pros?: string | null;
          rejectionReason?: string | null;
        };
        Update: {
          applicationId?: string;
          cons?: string | null;
          contactName?: string | null;
          coverLetter?: string | null;
          createdAt?: string | null;
          id?: string;
          jobPostingUrl?: string | null;
          notes?: string | null;
          pros?: string | null;
          rejectionReason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "application_details_applicationid_fkey";
            columns: ["applicationId"];
            isOneToOne: true;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_details_applicationId_fkey";
            columns: ["applicationId"];
            isOneToOne: true;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          appliedRole: string | null;
          companyName: string;
          createdAt: string | null;
          dateApplied: string | null;
          id: string;
          jobType: string | null;
          location: string | null;
          salaryRange: string | null;
          source: string | null;
          status: string | null;
          userId: string;
        };
        Insert: {
          appliedRole?: string | null;
          companyName: string;
          createdAt?: string | null;
          dateApplied?: string | null;
          id?: string;
          jobType?: string | null;
          location?: string | null;
          salaryRange?: string | null;
          source?: string | null;
          status?: string | null;
          userId: string;
        };
        Update: {
          appliedRole?: string | null;
          companyName?: string;
          createdAt?: string | null;
          dateApplied?: string | null;
          id?: string;
          jobType?: string | null;
          location?: string | null;
          salaryRange?: string | null;
          source?: string | null;
          status?: string | null;
          userId?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          bio: string | null;
          createdAt: string | null;
          firstName: string | null;
          github: string | null;
          lastName: string | null;
          linkedIn: string | null;
          location: string | null;
          portfolioUrl: string | null;
          skills: string | null;
          title: string | null;
          userId: string;
          yearsOfExperience: string | null;
        };
        Insert: {
          bio?: string | null;
          createdAt?: string | null;
          firstName?: string | null;
          github?: string | null;
          lastName?: string | null;
          linkedIn?: string | null;
          location?: string | null;
          portfolioUrl?: string | null;
          skills?: string | null;
          title?: string | null;
          userId: string;
          yearsOfExperience?: string | null;
        };
        Update: {
          bio?: string | null;
          createdAt?: string | null;
          firstName?: string | null;
          github?: string | null;
          lastName?: string | null;
          linkedIn?: string | null;
          location?: string | null;
          portfolioUrl?: string | null;
          skills?: string | null;
          title?: string | null;
          userId?: string;
          yearsOfExperience?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

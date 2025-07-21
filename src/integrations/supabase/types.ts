export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      conversation_tags: {
        Row: {
          conversation_id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          captured_at: string
          content: string
          created_at: string
          external_id: string | null
          id: string
          model_id: string | null
          platform: string
          project_id: string
          source: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          captured_at?: string
          content: string
          created_at?: string
          external_id?: string | null
          id?: string
          model_id?: string | null
          platform: string
          project_id: string
          source?: string | null
          status?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          captured_at?: string
          content?: string
          created_at?: string
          external_id?: string | null
          id?: string
          model_id?: string | null
          platform?: string
          project_id?: string
          source?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      framework_examples: {
        Row: {
          content: string
          created_at: string | null
          framework_id: string | null
          id: string
          ordinal: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          framework_id?: string | null
          id?: string
          ordinal: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          framework_id?: string | null
          id?: string
          ordinal?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "framework_examples_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      framework_fields: {
        Row: {
          framework_id: string | null
          help_text: string | null
          id: string
          label: string | null
          ordinal: number | null
        }
        Insert: {
          framework_id?: string | null
          help_text?: string | null
          id?: string
          label?: string | null
          ordinal?: number | null
        }
        Update: {
          framework_id?: string | null
          help_text?: string | null
          id?: string
          label?: string | null
          ordinal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_fields_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      frameworks: {
        Row: {
          description: string | null
          framework_type: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          framework_type?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          framework_type?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      knowledge: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          context_window: number | null
          display_name: string | null
          id: string
          provider: string | null
        }
        Insert: {
          context_window?: number | null
          display_name?: string | null
          id?: string
          provider?: string | null
        }
        Update: {
          context_window?: number | null
          display_name?: string | null
          id?: string
          provider?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_shares: {
        Row: {
          created_at: string
          id: string
          project_id: string
          shared_with_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          shared_with_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          shared_with_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          share_link: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          share_link?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          share_link?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_analytics: {
        Row: {
          created_at: string | null
          first_prompt_success: boolean | null
          framework_id: string | null
          id: string
          iteration_count: number | null
          prompt_content: string | null
          prompt_type: string
          response_content: string | null
          success_rating: number | null
          system_prompt_id: string | null
          time_to_completion_ms: number | null
          user_feedback: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_prompt_success?: boolean | null
          framework_id?: string | null
          id?: string
          iteration_count?: number | null
          prompt_content?: string | null
          prompt_type: string
          response_content?: string | null
          success_rating?: number | null
          system_prompt_id?: string | null
          time_to_completion_ms?: number | null
          user_feedback?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_prompt_success?: boolean | null
          framework_id?: string | null
          id?: string
          iteration_count?: number | null
          prompt_content?: string | null
          prompt_type?: string
          response_content?: string | null
          success_rating?: number | null
          system_prompt_id?: string | null
          time_to_completion_ms?: number | null
          user_feedback?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_analytics_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_system_prompt_id_fkey"
            columns: ["system_prompt_id"]
            isOneToOne: false
            referencedRelation: "system_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_tests: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          id: string
          raw_response: string | null
          response_ms: number | null
          tokens_in: number | null
          tokens_out: number | null
          version_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          raw_response?: string | null
          response_ms?: number | null
          tokens_in?: number | null
          tokens_out?: number | null
          version_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          raw_response?: string | null
          response_ms?: number | null
          tokens_in?: number | null
          tokens_out?: number | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_tests_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_versions: {
        Row: {
          compiled_text: string | null
          created_at: string | null
          field_values: Json | null
          id: string
          max_tokens: number | null
          model_id: string | null
          prompt_id: string | null
          temperature: number | null
          version_number: number | null
        }
        Insert: {
          compiled_text?: string | null
          created_at?: string | null
          field_values?: Json | null
          id?: string
          max_tokens?: number | null
          model_id?: string | null
          prompt_id?: string | null
          temperature?: number | null
          version_number?: number | null
        }
        Update: {
          compiled_text?: string | null
          created_at?: string | null
          field_values?: Json | null
          id?: string
          max_tokens?: number | null
          model_id?: string | null
          prompt_id?: string | null
          temperature?: number | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          created_at: string | null
          framework_id: string | null
          id: string
          owner_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          framework_id?: string | null
          id?: string
          owner_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          framework_id?: string | null
          id?: string
          owner_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      system_prompts: {
        Row: {
          active: boolean | null
          created_at: string | null
          framework_type: string
          id: string
          name: string
          performance_score: number | null
          prompt_text: string
          updated_at: string | null
          usage_count: number | null
          version: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          framework_type: string
          id?: string
          name: string
          performance_score?: number | null
          prompt_text: string
          updated_at?: string | null
          usage_count?: number | null
          version: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          framework_type?: string
          id?: string
          name?: string
          performance_score?: number | null
          prompt_text?: string
          updated_at?: string | null
          usage_count?: number | null
          version?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          created_at: string
          description: string | null
          id: string
          model: string
          name: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          model: string
          name: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          model?: string
          name?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "customer"],
    },
  },
} as const

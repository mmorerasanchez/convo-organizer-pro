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
      content_embeddings: {
        Row: {
          chunk_index: number | null
          chunk_text: string
          content_id: string
          content_type: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          project_id: string
        }
        Insert: {
          chunk_index?: number | null
          chunk_text: string
          content_id: string
          content_type: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
        }
        Update: {
          chunk_index?: number | null
          chunk_text?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_embeddings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      context_usage: {
        Row: {
          context_items: Json | null
          conversation_id: string | null
          created_at: string | null
          effectiveness_score: number | null
          id: string
          project_id: string
        }
        Insert: {
          context_items?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          project_id: string
        }
        Update: {
          context_items?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "context_usage_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "context_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
          context_tags: Json | null
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
          used_context_ids: string[] | null
        }
        Insert: {
          captured_at?: string
          content: string
          context_tags?: Json | null
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
          used_context_ids?: string[] | null
        }
        Update: {
          captured_at?: string
          content?: string
          context_tags?: Json | null
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
          used_context_ids?: string[] | null
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
      learning_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_details: string | null
          id: string
          job_type: string
          processed_items: number | null
          project_id: string
          started_at: string | null
          status: string | null
          total_items: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_details?: string | null
          id?: string
          job_type: string
          processed_items?: number | null
          project_id: string
          started_at?: string | null
          status?: string | null
          total_items?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_details?: string | null
          id?: string
          job_type?: string
          processed_items?: number | null
          project_id?: string
          started_at?: string | null
          status?: string | null
          total_items?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_jobs_project_id_fkey"
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
      project_contexts: {
        Row: {
          context_summary: string
          created_at: string | null
          id: string
          key_themes: Json | null
          learning_metadata: Json | null
          project_id: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          context_summary: string
          created_at?: string | null
          id?: string
          key_themes?: Json | null
          learning_metadata?: Json | null
          project_id: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          context_summary?: string
          created_at?: string | null
          id?: string
          key_themes?: Json | null
          learning_metadata?: Json | null
          project_id?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contexts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
          context_enabled: boolean | null
          context_quality_score: number | null
          created_at: string
          description: string | null
          id: string
          last_learning_run: string | null
          learning_frequency: string | null
          name: string
          share_link: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_enabled?: boolean | null
          context_quality_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_learning_run?: string | null
          learning_frequency?: string | null
          name: string
          share_link?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_enabled?: boolean | null
          context_quality_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_learning_run?: string | null
          learning_frequency?: string | null
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
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      search_project_context: {
        Args: {
          project_id: string
          query_embedding: string
          content_types: string[]
          similarity_threshold?: number
          match_limit?: number
        }
        Returns: {
          content_id: string
          content_type: string
          chunk_text: string
          similarity: number
          metadata: Json
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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

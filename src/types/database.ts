export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      calculation_snapshots: {
        Row: {
          created_at: string
          event_id: string
          id: string
          normalized_input: Json
          result_snapshot: Json
          rules_version: string
          sequence_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          normalized_input: Json
          result_snapshot: Json
          rules_version: string
          sequence_number: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          normalized_input?: Json
          result_snapshot?: Json
          rules_version?: string
          sequence_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculation_snapshots_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string
          custom_title: string | null
          event_id: string
          id: string
          is_completed: boolean
          item_key: string | null
          snapshot_id: string | null
          sort_order: number
          source: string
          timing_group: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_title?: string | null
          event_id: string
          id?: string
          is_completed?: boolean
          item_key?: string | null
          snapshot_id?: string | null
          sort_order?: number
          source?: string
          timing_group: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_title?: string | null
          event_id?: string
          id?: string
          is_completed?: boolean
          item_key?: string | null
          snapshot_id?: string | null
          sort_order?: number
          source?: string
          timing_group?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "checklist_items_snapshot_owner_fkey"
            columns: ["snapshot_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "calculation_snapshots"
            referencedColumns: ["id", "event_id", "user_id"]
          },
        ]
      }
      event_guests: {
        Row: {
          adults_count: number
          children_count: number
          created_at: string
          email: string | null
          event_id: string
          id: string
          invited_at: string | null
          name: string
          note: string | null
          phone: string | null
          responded_at: string | null
          rsvp_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adults_count?: number
          children_count?: number
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          invited_at?: string | null
          name: string
          note?: string | null
          phone?: string | null
          responded_at?: string | null
          rsvp_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adults_count?: number
          children_count?: number
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          invited_at?: string | null
          name?: string
          note?: string | null
          phone?: string | null
          responded_at?: string | null
          rsvp_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      event_invitation_links: {
        Row: {
          created_at: string
          event_id: string
          expires_at: string
          guest_id: string | null
          id: string
          label: string | null
          link_type: string
          max_responses: number | null
          revoked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          expires_at: string
          guest_id?: string | null
          id?: string
          label?: string | null
          link_type: string
          max_responses?: number | null
          revoked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          expires_at?: string
          guest_id?: string | null
          id?: string
          label?: string | null
          link_type?: string
          max_responses?: number | null
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_invitation_links_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "event_invitation_links_guest_event_owner_fkey"
            columns: ["guest_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "event_guests"
            referencedColumns: ["id", "event_id", "user_id"]
          },
        ]
      }
      event_invitation_responses: {
        Row: {
          created_at: string
          event_id: string
          guest_id: string
          id: string
          invitation_link_id: string
          profile_id: string | null
          response_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_id: string
          id?: string
          invitation_link_id: string
          profile_id?: string | null
          response_key?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_id?: string
          id?: string
          invitation_link_id?: string
          profile_id?: string | null
          response_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_invitation_responses_guest_event_owner_fkey"
            columns: ["guest_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "event_guests"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "event_invitation_responses_link_event_owner_fkey"
            columns: ["invitation_link_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "event_invitation_links"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "event_invitation_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_members: {
        Row: {
          created_at: string
          event_id: string
          guest_id: string | null
          id: string
          invited_by: string
          joined_at: string | null
          membership_status: string
          profile_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_id?: string | null
          id?: string
          invited_by: string
          joined_at?: string | null
          membership_status?: string
          profile_id: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_id?: string | null
          id?: string
          invited_by?: string
          joined_at?: string | null
          membership_status?: string
          profile_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_members_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "event_members_guest_event_owner_fkey"
            columns: ["guest_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "event_guests"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "event_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          adults_count: number
          alcohol_guests_count: number
          budget_amount: number | null
          budget_feedback_at: string | null
          budget_outcome: string | null
          children_count: number
          completed_at: string | null
          created_at: string
          currency: string
          current_snapshot_id: string | null
          drink_categories: string[]
          duration_hours: number
          event_type: string
          id: string
          location: string
          location_text: string | null
          menu_format: string
          name: string
          notes: string | null
          starts_at: string
          status: string
          time_zone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adults_count: number
          alcohol_guests_count: number
          budget_amount?: number | null
          budget_feedback_at?: string | null
          budget_outcome?: string | null
          children_count: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          current_snapshot_id?: string | null
          drink_categories?: string[]
          duration_hours: number
          event_type: string
          id?: string
          location: string
          location_text?: string | null
          menu_format: string
          name: string
          notes?: string | null
          starts_at: string
          status?: string
          time_zone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adults_count?: number
          alcohol_guests_count?: number
          budget_amount?: number | null
          budget_feedback_at?: string | null
          budget_outcome?: string | null
          children_count?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          current_snapshot_id?: string | null
          drink_categories?: string[]
          duration_hours?: number
          event_type?: string
          id?: string
          location?: string
          location_text?: string | null
          menu_format?: string
          name?: string
          notes?: string | null
          starts_at?: string
          status?: string
          time_zone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_current_snapshot_fkey"
            columns: ["current_snapshot_id", "id", "user_id"]
            isOneToOne: false
            referencedRelation: "calculation_snapshots"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_units: {
        Row: {
          base_multiplier: number
          code: string
          created_at: string
          dimension: string
          is_active: boolean
          sort_order: number
          symbol_en: string
          symbol_uk: string
          updated_at: string
        }
        Insert: {
          base_multiplier: number
          code: string
          created_at?: string
          dimension: string
          is_active?: boolean
          sort_order?: number
          symbol_en: string
          symbol_uk: string
          updated_at?: string
        }
        Update: {
          base_multiplier?: number
          code?: string
          created_at?: string
          dimension?: string
          is_active?: boolean
          sort_order?: number
          symbol_en?: string
          symbol_uk?: string
          updated_at?: string
        }
        Relationships: []
      }
      plan_targets: {
        Row: {
          category: string
          created_at: string
          event_id: string
          explanation: Json
          id: string
          snapshot_id: string
          sort_order: number
          target_quantity: number
          unit: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          event_id: string
          explanation?: Json
          id?: string
          snapshot_id: string
          sort_order?: number
          target_quantity: number
          unit: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          event_id?: string
          explanation?: Json
          id?: string
          snapshot_id?: string
          sort_order?: number
          target_quantity?: number
          unit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_targets_snapshot_owner_fkey"
            columns: ["snapshot_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "calculation_snapshots"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "plan_targets_unit_fkey"
            columns: ["unit"]
            isOneToOne: false
            referencedRelation: "measurement_units"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_purchased: boolean
          name: string
          note: string | null
          package_count: number | null
          package_size: number | null
          plan_target_id: string | null
          quantity: number
          sort_order: number
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_purchased?: boolean
          name: string
          note?: string | null
          package_count?: number | null
          package_size?: number | null
          plan_target_id?: string | null
          quantity: number
          sort_order?: number
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_purchased?: boolean
          name?: string
          note?: string | null
          package_count?: number | null
          package_size?: number | null
          plan_target_id?: string | null
          quantity?: number
          sort_order?: number
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_event_owner_fkey"
            columns: ["event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "shopping_items_target_owner_fkey"
            columns: ["plan_target_id", "event_id", "user_id"]
            isOneToOne: false
            referencedRelation: "plan_targets"
            referencedColumns: ["id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "shopping_items_unit_fkey"
            columns: ["unit"]
            isOneToOne: false
            referencedRelation: "measurement_units"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_open_event_invitation: {
        Args: {
          p_event_id: string
          p_expires_in_days?: number
          p_user_id: string
        }
        Returns: {
          invitation_expires_at: string
          invitation_id: string
        }[]
      }
      get_event_invitation_by_token: {
        Args: { p_token: string }
        Returns: {
          event_id: string
          event_name: string
          event_type: string
          expires_at: string
          invitation_id: string
          location_text: string
          organizer_name: string
          starts_at: string
          time_zone: string
        }[]
      }
      submit_event_invitation_response: {
        Args: {
          p_adults_count: number
          p_children_count: number
          p_name: string
          p_profile_id?: string
          p_response_key: string
          p_rsvp_status: string
          p_token: string
        }
        Returns: {
          linked_to_profile: boolean
          response_event_id: string
          response_guest_id: string
        }[]
      }
      update_event_plan: {
        Args: {
          p_checklist_items: Json
          p_event_data: Json
          p_event_id: string
          p_normalized_input: Json
          p_result_snapshot: Json
          p_rules_version: string
          p_targets: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

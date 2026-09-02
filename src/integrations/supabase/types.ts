export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      automation_config_versions: {
        Row: {
          activated_at: string | null;
          actor_label: string;
          change_reason: string | null;
          config: Json;
          created_at: string;
          id: string;
          is_active: boolean;
          rolled_back_from: number | null;
          source: string;
          version: number;
        };
        Insert: {
          activated_at?: string | null;
          actor_label?: string;
          change_reason?: string | null;
          config: Json;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          rolled_back_from?: number | null;
          source?: string;
          version: number;
        };
        Update: {
          activated_at?: string | null;
          actor_label?: string;
          change_reason?: string | null;
          config?: Json;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          rolled_back_from?: number | null;
          source?: string;
          version?: number;
        };
        Relationships: [];
      };
      automation_executions: {
        Row: {
          actor_label: string;
          created_at: string;
          demo_request_id: string | null;
          detail: Json | null;
          execution_key: string;
          id: string;
          mode: string;
          outcome: string;
          playbook_key: string;
          playbook_version: number;
          reason_code: string;
        };
        Insert: {
          actor_label?: string;
          created_at?: string;
          demo_request_id?: string | null;
          detail?: Json | null;
          execution_key: string;
          id?: string;
          mode: string;
          outcome: string;
          playbook_key: string;
          playbook_version: number;
          reason_code: string;
        };
        Update: {
          actor_label?: string;
          created_at?: string;
          demo_request_id?: string | null;
          detail?: Json | null;
          execution_key?: string;
          id?: string;
          mode?: string;
          outcome?: string;
          playbook_key?: string;
          playbook_version?: number;
          reason_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_executions_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      automation_recommendations: {
        Row: {
          action_payload: Json | null;
          action_type: string;
          actor_label: string;
          created_at: string;
          demo_request_id: string;
          execution_key: string;
          explanation: string | null;
          id: string;
          playbook_key: string;
          playbook_version: number;
          reason_codes: string[];
          resolved_at: string | null;
          snooze_until: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          action_payload?: Json | null;
          action_type: string;
          actor_label?: string;
          created_at?: string;
          demo_request_id: string;
          execution_key: string;
          explanation?: string | null;
          id?: string;
          playbook_key: string;
          playbook_version: number;
          reason_codes?: string[];
          resolved_at?: string | null;
          snooze_until?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          action_payload?: Json | null;
          action_type?: string;
          actor_label?: string;
          created_at?: string;
          demo_request_id?: string;
          execution_key?: string;
          explanation?: string | null;
          id?: string;
          playbook_key?: string;
          playbook_version?: number;
          reason_codes?: string[];
          resolved_at?: string | null;
          snooze_until?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_recommendations_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      automation_settings: {
        Row: {
          actor_label: string;
          created_at: string;
          id: string;
          kill_switch: boolean;
          mode: string;
          updated_at: string;
        };
        Insert: {
          actor_label?: string;
          created_at?: string;
          id?: string;
          kill_switch?: boolean;
          mode?: string;
          updated_at?: string;
        };
        Update: {
          actor_label?: string;
          created_at?: string;
          id?: string;
          kill_switch?: boolean;
          mode?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversion_events: {
        Row: {
          created_at: string;
          demo_request_id: string | null;
          event_name: string;
          id: string;
          metadata: Json | null;
          occurred_at: string;
          source_cta: string | null;
          source_route: string | null;
          utm_campaign: string | null;
        };
        Insert: {
          created_at?: string;
          demo_request_id?: string | null;
          event_name: string;
          id?: string;
          metadata?: Json | null;
          occurred_at?: string;
          source_cta?: string | null;
          source_route?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          created_at?: string;
          demo_request_id?: string | null;
          event_name?: string;
          id?: string;
          metadata?: Json | null;
          occurred_at?: string;
          source_cta?: string | null;
          source_route?: string | null;
          utm_campaign?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conversion_events_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      demo_request_context: {
        Row: {
          created_at: string;
          demo_request_id: string;
          elapsed_ms: number | null;
          fbclid: string | null;
          gclid: string | null;
          id: string;
          landing_path: string | null;
          page_title: string | null;
          referrer: string | null;
          source_cta: string | null;
          source_route: string | null;
          user_agent: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
        };
        Insert: {
          created_at?: string;
          demo_request_id: string;
          elapsed_ms?: number | null;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          landing_path?: string | null;
          page_title?: string | null;
          referrer?: string | null;
          source_cta?: string | null;
          source_route?: string | null;
          user_agent?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Update: {
          created_at?: string;
          demo_request_id?: string;
          elapsed_ms?: number | null;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          landing_path?: string | null;
          page_title?: string | null;
          referrer?: string | null;
          source_cta?: string | null;
          source_route?: string | null;
          user_agent?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "demo_request_context_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      demo_requests: {
        Row: {
          company: string;
          consent: boolean;
          consent_at: string | null;
          created_at: string;
          email: string;
          id: string;
          idempotency_key: string;
          monthly_leads: string;
          name: string;
          notes: string | null;
          phone: string | null;
          primary_goal: string;
          status: string;
          submitted_at: string;
          updated_at: string;
          website: string;
        };
        Insert: {
          company: string;
          consent?: boolean;
          consent_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          idempotency_key: string;
          monthly_leads: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          primary_goal: string;
          status?: string;
          submitted_at?: string;
          updated_at?: string;
          website: string;
        };
        Update: {
          company?: string;
          consent?: boolean;
          consent_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          idempotency_key?: string;
          monthly_leads?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          primary_goal?: string;
          status?: string;
          submitted_at?: string;
          updated_at?: string;
          website?: string;
        };
        Relationships: [];
      };
      lead_activity: {
        Row: {
          activity_type: string;
          actor_label: string;
          created_at: string;
          demo_request_id: string;
          id: string;
          metadata: Json | null;
          note: string | null;
        };
        Insert: {
          activity_type: string;
          actor_label?: string;
          created_at?: string;
          demo_request_id: string;
          id?: string;
          metadata?: Json | null;
          note?: string | null;
        };
        Update: {
          activity_type?: string;
          actor_label?: string;
          created_at?: string;
          demo_request_id?: string;
          id?: string;
          metadata?: Json | null;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_activity_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_deliveries: {
        Row: {
          attempt_count: number;
          created_at: string;
          demo_request_id: string;
          destination: string;
          id: string;
          last_attempt_at: string | null;
          last_error: string | null;
          next_attempt_at: string;
          provider_ref: string | null;
          response_meta: Json | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          attempt_count?: number;
          created_at?: string;
          demo_request_id: string;
          destination?: string;
          id?: string;
          last_attempt_at?: string | null;
          last_error?: string | null;
          next_attempt_at?: string;
          provider_ref?: string | null;
          response_meta?: Json | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          attempt_count?: number;
          created_at?: string;
          demo_request_id?: string;
          destination?: string;
          id?: string;
          last_attempt_at?: string | null;
          last_error?: string | null;
          next_attempt_at?: string;
          provider_ref?: string | null;
          response_meta?: Json | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_deliveries_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_tasks: {
        Row: {
          actor_label: string;
          completed_at: string | null;
          created_at: string;
          demo_request_id: string;
          description: string | null;
          due_at: string | null;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          actor_label?: string;
          completed_at?: string | null;
          created_at?: string;
          demo_request_id: string;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          actor_label?: string;
          completed_at?: string | null;
          created_at?: string;
          demo_request_id?: string;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_tasks_demo_request_id_fkey";
            columns: ["demo_request_id"];
            isOneToOne: false;
            referencedRelation: "demo_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      submission_throttle: {
        Row: {
          blocked_count: number;
          hit_count: number;
          id: string;
          signal_hash: string;
          updated_at: string;
          window_start: string;
        };
        Insert: {
          blocked_count?: number;
          hit_count?: number;
          id?: string;
          signal_hash: string;
          updated_at?: string;
          window_start?: string;
        };
        Update: {
          blocked_count?: number;
          hit_count?: number;
          id?: string;
          signal_hash?: string;
          updated_at?: string;
          window_start?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      purge_expired_lead_data: {
        Args: { retention_days?: number };
        Returns: number;
      };
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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

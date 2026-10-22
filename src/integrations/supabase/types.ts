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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      account_memberships: {
        Row: {
          account_id: string
          created_at: string
          role: Database["public"]["Enums"]["account_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          role?: Database["public"]["Enums"]["account_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          role?: Database["public"]["Enums"]["account_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_memberships_account_id_tenant_id_fkey"
            columns: ["account_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "account_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_config_versions: {
        Row: {
          activated_at: string | null
          actor_label: string
          actor_user_id: string | null
          change_reason: string | null
          config: Json
          created_at: string
          id: string
          is_active: boolean
          rolled_back_from: number | null
          source: string
          version: number
        }
        Insert: {
          activated_at?: string | null
          actor_label?: string
          actor_user_id?: string | null
          change_reason?: string | null
          config: Json
          created_at?: string
          id?: string
          is_active?: boolean
          rolled_back_from?: number | null
          source?: string
          version: number
        }
        Update: {
          activated_at?: string | null
          actor_label?: string
          actor_user_id?: string | null
          change_reason?: string | null
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          rolled_back_from?: number | null
          source?: string
          version?: number
        }
        Relationships: []
      }
      automation_executions: {
        Row: {
          actor_label: string
          actor_user_id: string | null
          created_at: string
          demo_request_id: string | null
          detail: Json | null
          execution_key: string
          id: string
          mode: string
          outcome: string
          playbook_key: string
          playbook_version: number
          reason_code: string
        }
        Insert: {
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id?: string | null
          detail?: Json | null
          execution_key: string
          id?: string
          mode: string
          outcome: string
          playbook_key: string
          playbook_version: number
          reason_code: string
        }
        Update: {
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id?: string | null
          detail?: Json | null
          execution_key?: string
          id?: string
          mode?: string
          outcome?: string
          playbook_key?: string
          playbook_version?: number
          reason_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_recommendations: {
        Row: {
          action_payload: Json | null
          action_type: string
          actor_label: string
          actor_user_id: string | null
          created_at: string
          demo_request_id: string
          execution_key: string
          explanation: string | null
          id: string
          playbook_key: string
          playbook_version: number
          reason_codes: string[]
          resolved_at: string | null
          snooze_until: string | null
          status: string
          updated_at: string
        }
        Insert: {
          action_payload?: Json | null
          action_type: string
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id: string
          execution_key: string
          explanation?: string | null
          id?: string
          playbook_key: string
          playbook_version: number
          reason_codes?: string[]
          resolved_at?: string | null
          snooze_until?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          action_payload?: Json | null
          action_type?: string
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id?: string
          execution_key?: string
          explanation?: string | null
          id?: string
          playbook_key?: string
          playbook_version?: number
          reason_codes?: string[]
          resolved_at?: string | null
          snooze_until?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_recommendations_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_settings: {
        Row: {
          actor_label: string
          actor_user_id: string | null
          created_at: string
          id: string
          kill_switch: boolean
          mode: string
          updated_at: string
        }
        Insert: {
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          kill_switch?: boolean
          mode?: string
          updated_at?: string
        }
        Update: {
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          kill_switch?: boolean
          mode?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          created_at: string
          demo_request_id: string | null
          event_name: string
          id: string
          metadata: Json | null
          occurred_at: string
          source_cta: string | null
          source_route: string | null
          utm_campaign: string | null
        }
        Insert: {
          created_at?: string
          demo_request_id?: string | null
          event_name: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          source_cta?: string | null
          source_route?: string | null
          utm_campaign?: string | null
        }
        Update: {
          created_at?: string
          demo_request_id?: string | null
          event_name?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          source_cta?: string | null
          source_route?: string | null
          utm_campaign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_events_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_request_context: {
        Row: {
          created_at: string
          demo_request_id: string
          elapsed_ms: number | null
          fbclid: string | null
          gclid: string | null
          id: string
          landing_path: string | null
          page_title: string | null
          referrer: string | null
          source_cta: string | null
          source_route: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          demo_request_id: string
          elapsed_ms?: number | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source_cta?: string | null
          source_route?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          demo_request_id?: string
          elapsed_ms?: number | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source_cta?: string | null
          source_route?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_request_context_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company: string
          consent: boolean
          consent_at: string | null
          created_at: string
          email: string
          id: string
          idempotency_key: string
          monthly_leads: string
          name: string
          notes: string | null
          phone: string | null
          primary_goal: string
          status: string
          submitted_at: string
          updated_at: string
          website: string
        }
        Insert: {
          company: string
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email: string
          id?: string
          idempotency_key: string
          monthly_leads: string
          name: string
          notes?: string | null
          phone?: string | null
          primary_goal: string
          status?: string
          submitted_at?: string
          updated_at?: string
          website: string
        }
        Update: {
          company?: string
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email?: string
          id?: string
          idempotency_key?: string
          monthly_leads?: string
          name?: string
          notes?: string | null
          phone?: string | null
          primary_goal?: string
          status?: string
          submitted_at?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      internal_users: {
        Row: {
          created_at: string
          disabled_at: string | null
          display_label: string
          role: Database["public"]["Enums"]["internal_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disabled_at?: string | null
          display_label: string
          role?: Database["public"]["Enums"]["internal_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disabled_at?: string | null
          display_label?: string
          role?: Database["public"]["Enums"]["internal_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_activity: {
        Row: {
          activity_type: string
          actor_label: string
          actor_user_id: string | null
          created_at: string
          demo_request_id: string
          id: string
          metadata: Json | null
          note: string | null
        }
        Insert: {
          activity_type: string
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id: string
          id?: string
          metadata?: Json | null
          note?: string | null
        }
        Update: {
          activity_type?: string
          actor_label?: string
          actor_user_id?: string | null
          created_at?: string
          demo_request_id?: string
          id?: string
          metadata?: Json | null
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activity_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_deliveries: {
        Row: {
          attempt_count: number
          created_at: string
          demo_request_id: string
          destination: string
          id: string
          last_attempt_at: string | null
          last_error: string | null
          next_attempt_at: string
          provider_ref: string | null
          response_meta: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          demo_request_id: string
          destination?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          next_attempt_at?: string
          provider_ref?: string | null
          response_meta?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          demo_request_id?: string
          destination?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          next_attempt_at?: string
          provider_ref?: string | null
          response_meta?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_deliveries_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tasks: {
        Row: {
          actor_label: string
          actor_user_id: string | null
          completed_at: string | null
          created_at: string
          demo_request_id: string
          description: string | null
          due_at: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          actor_label?: string
          actor_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          demo_request_id: string
          description?: string | null
          due_at?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          actor_label?: string
          actor_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          demo_request_id?: string
          description?: string | null
          due_at?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_demo_request_id_fkey"
            columns: ["demo_request_id"]
            isOneToOne: false
            referencedRelation: "demo_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_agent_runs: {
        Row: {
          agent: string
          created_at: string
          detail: Json
          id: string
          scout_run_id: string | null
          status: string
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          agent: string
          created_at?: string
          detail?: Json
          id?: string
          scout_run_id?: string | null
          status?: string
          tenant_id: string
          workspace_id: string
        }
        Update: {
          agent?: string
          created_at?: string
          detail?: Json
          id?: string
          scout_run_id?: string | null
          status?: string
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_agent_runs_scout_run_id_tenant_id_fkey"
            columns: ["scout_run_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_runs"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_agent_runs_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_approvals: {
        Row: {
          action: string
          actor_user_id: string
          created_at: string
          id: string
          opportunity_id: string
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string
          created_at?: string
          id?: string
          opportunity_id: string
          tenant_id: string
          workspace_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          opportunity_id?: string
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_approvals_opportunity_id_tenant_id_fkey"
            columns: ["opportunity_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_opportunities"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_approvals_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_businesses: {
        Row: {
          created_at: string
          geography: string | null
          id: string
          industry: string
          is_demo: boolean
          name: string
          tenant_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          geography?: string | null
          id?: string
          industry: string
          is_demo?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          geography?: string | null
          id?: string
          industry?: string
          is_demo?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_businesses_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_connector_configs: {
        Row: {
          created_at: string
          credential_reference: string | null
          id: string
          provider: string
          status: string
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          credential_reference?: string | null
          id?: string
          provider: string
          status?: string
          tenant_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          credential_reference?: string | null
          id?: string
          provider?: string
          status?: string
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_connector_configs_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_contacts: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          name: string | null
          public_url: string | null
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          public_url?: string | null
          tenant_id: string
          workspace_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          public_url?: string | null
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_contacts_business_id_tenant_id_fkey"
            columns: ["business_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_businesses"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_contacts_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_opportunities: {
        Row: {
          business_id: string | null
          created_at: string
          estimated_max: number
          estimated_min: number
          external_key: string
          id: string
          is_demo: boolean
          score: number
          signal_id: string | null
          solution_id: string | null
          status: string
          tenant_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          estimated_max?: number
          estimated_min?: number
          external_key: string
          id?: string
          is_demo?: boolean
          score?: number
          signal_id?: string | null
          solution_id?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          estimated_max?: number
          estimated_min?: number
          external_key?: string
          id?: string
          is_demo?: boolean
          score?: number
          signal_id?: string | null
          solution_id?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_opportunities_business_id_tenant_id_fkey"
            columns: ["business_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_businesses"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_opportunities_signal_id_tenant_id_fkey"
            columns: ["signal_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_signals"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_opportunities_solution_id_tenant_id_fkey"
            columns: ["solution_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_solution_catalog"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_opportunities_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_opportunity_scores: {
        Row: {
          components: Json
          created_at: string
          id: string
          opportunity_id: string
          tenant_id: string
          total: number
          weights: Json
          workspace_id: string
        }
        Insert: {
          components: Json
          created_at?: string
          id?: string
          opportunity_id: string
          tenant_id: string
          total: number
          weights: Json
          workspace_id: string
        }
        Update: {
          components?: Json
          created_at?: string
          id?: string
          opportunity_id?: string
          tenant_id?: string
          total?: number
          weights?: Json
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_opportunity_scores_opportunity_id_tenant_id_fkey"
            columns: ["opportunity_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_opportunities"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_opportunity_scores_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_outcome_events: {
        Row: {
          actor_user_id: string
          created_at: string
          id: string
          opportunity_id: string
          outcome: string
          simulated: boolean
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          actor_user_id?: string
          created_at?: string
          id?: string
          opportunity_id: string
          outcome: string
          simulated?: boolean
          tenant_id: string
          workspace_id: string
        }
        Update: {
          actor_user_id?: string
          created_at?: string
          id?: string
          opportunity_id?: string
          outcome?: string
          simulated?: boolean
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_outcome_events_opportunity_id_tenant_id_fkey"
            columns: ["opportunity_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_opportunities"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_outcome_events_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_outreach_drafts: {
        Row: {
          channel: string
          created_at: string
          id: string
          messages: Json
          opportunity_id: string
          simulated: boolean
          status: string
          tenant_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          messages?: Json
          opportunity_id: string
          simulated?: boolean
          status?: string
          tenant_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          messages?: Json
          opportunity_id?: string
          simulated?: boolean
          status?: string
          tenant_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_outreach_drafts_opportunity_id_tenant_id_fkey"
            columns: ["opportunity_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_opportunities"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_outreach_drafts_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_outreach_events: {
        Row: {
          actor_user_id: string
          created_at: string
          detail: string
          event_key: string
          id: string
          kind: string
          opportunity_id: string | null
          simulated: boolean
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          actor_user_id?: string
          created_at?: string
          detail: string
          event_key: string
          id?: string
          kind: string
          opportunity_id?: string | null
          simulated?: boolean
          tenant_id: string
          workspace_id: string
        }
        Update: {
          actor_user_id?: string
          created_at?: string
          detail?: string
          event_key?: string
          id?: string
          kind?: string
          opportunity_id?: string | null
          simulated?: boolean
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_outreach_events_opportunity_id_tenant_id_fkey"
            columns: ["opportunity_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_opportunities"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_outreach_events_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_playbooks: {
        Row: {
          created_at: string
          id: string
          industry: string
          name: string
          tenant_id: string
          threshold: number
          updated_at: string
          weights: Json
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry: string
          name: string
          tenant_id: string
          threshold?: number
          updated_at?: string
          weights?: Json
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string
          name?: string
          tenant_id?: string
          threshold?: number
          updated_at?: string
          weights?: Json
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_playbooks_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_runs: {
        Row: {
          created_at: string
          id: string
          mode: string
          signal_count: number
          status: string
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode?: string
          signal_count?: number
          status?: string
          tenant_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          signal_count?: number
          status?: string
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_runs_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_signals: {
        Row: {
          business_id: string | null
          created_at: string
          external_key: string
          id: string
          intent: string | null
          is_demo: boolean
          original_text: string
          pain: string | null
          public_url: string | null
          published_at: string | null
          source_id: string | null
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          external_key: string
          id?: string
          intent?: string | null
          is_demo?: boolean
          original_text: string
          pain?: string | null
          public_url?: string | null
          published_at?: string | null
          source_id?: string | null
          tenant_id: string
          workspace_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          external_key?: string
          id?: string
          intent?: string | null
          is_demo?: boolean
          original_text?: string
          pain?: string | null
          public_url?: string | null
          published_at?: string | null
          source_id?: string | null
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_signals_business_id_tenant_id_fkey"
            columns: ["business_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_businesses"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_signals_source_id_tenant_id_fkey"
            columns: ["source_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_sources"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_signals_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_solution_catalog: {
        Row: {
          created_at: string
          id: string
          name: string
          offer: string
          pain_tags: string[]
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          offer: string
          pain_tags?: string[]
          tenant_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          offer?: string
          pain_tags?: string[]
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_solution_catalog_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_sources: {
        Row: {
          created_at: string
          id: string
          mode: string
          name: string
          provider: string
          status: string
          tenant_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode?: string
          name: string
          provider: string
          status?: string
          tenant_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          name?: string
          provider?: string
          status?: string
          tenant_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_sources_workspace_id_tenant_id_fkey"
            columns: ["workspace_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "scout_workspaces"
            referencedColumns: ["id", "tenant_id"]
          },
        ]
      }
      scout_workspaces: {
        Row: {
          account_id: string
          created_at: string
          id: string
          is_demo: boolean
          name: string
          revision: number
          state: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          revision?: number
          state?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          revision?: number
          state?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_workspaces_account_id_tenant_id_fkey"
            columns: ["account_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "scout_workspaces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_throttle: {
        Row: {
          blocked_count: number
          hit_count: number
          id: string
          signal_hash: string
          updated_at: string
          window_start: string
        }
        Insert: {
          blocked_count?: number
          hit_count?: number
          id?: string
          signal_hash: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          blocked_count?: number
          hit_count?: number
          id?: string
          signal_hash?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_account_role: {
        Args: {
          allowed_roles: Database["public"]["Enums"]["account_role"][]
          target_account_id: string
        }
        Returns: boolean
      }
      has_internal_role: {
        Args: {
          _roles: Database["public"]["Enums"]["internal_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      is_account_member: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      purge_expired_lead_data: {
        Args: { retention_days?: number }
        Returns: number
      }
    }
    Enums: {
      account_role: "owner" | "admin" | "operator" | "analyst" | "viewer"
      internal_role: "viewer" | "ops" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      account_role: ["owner", "admin", "operator", "analyst", "viewer"],
      internal_role: ["viewer", "ops", "admin"],
    },
  },
} as const

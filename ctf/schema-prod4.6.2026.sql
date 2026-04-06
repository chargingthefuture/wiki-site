CREATE SCHEMA "public";
CREATE SCHEMA "_system";
CREATE TABLE "admin_action_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"admin_id" varchar NOT NULL,
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" varchar,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "announcement_delivery_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"announcement_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "announcement_membership_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"user_id" text NOT NULL,
	"plugin_id" text NOT NULL,
	"event_type" text NOT NULL,
	"request_id" text,
	"trace_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "announcement_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"announcement_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"status" text NOT NULL,
	"priority" integer NOT NULL,
	"mandatory" boolean NOT NULL,
	"schedule_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"targeting" jsonb DEFAULT '{}' NOT NULL,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revision_number" integer DEFAULT 0 NOT NULL
);
CREATE TABLE "announcement_user_state" (
	"user_id" text,
	"announcement_id" uuid,
	"read_at" timestamp with time zone,
	"acknowledged_at" timestamp with time zone,
	"dismissed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "announcement_user_state_pkey" PRIMARY KEY("user_id","announcement_id")
);
CREATE TABLE "announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"show_on_login" boolean DEFAULT false NOT NULL,
	"show_on_sign_in_page" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"status" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"schedule_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"targeting" jsonb DEFAULT '{}' NOT NULL,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL
);
CREATE TABLE "auth_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"token" varchar(64) NOT NULL CONSTRAINT "auth_tokens_token_key" UNIQUE,
	"user_id" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "chat_groups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(200) NOT NULL,
	"signal_url" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "chat_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"channel_id" varchar DEFAULT 'community-support' NOT NULL,
	"user_id" varchar NOT NULL,
	"user_image" text,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" varchar,
	"last_name" varchar
);
CREATE TABLE "chatgroups_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "chyme_deletion_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"scope" text NOT NULL,
	"service_name" text NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	CONSTRAINT "chyme_deletion_events_scope_check" CHECK ((scope = ANY (ARRAY['service'::text, 'account'::text]))),
	CONSTRAINT "chyme_deletion_events_status_check" CHECK ((status = ANY (ARRAY['requested'::text, 'processing'::text, 'completed'::text, 'failed'::text])))
);
CREATE TABLE "chyme_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"room_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"username" text,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"text" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"author_username" varchar(64),
	CONSTRAINT "chyme_messages_text_check" CHECK (((char_length(text) >= 1) AND (char_length(text) <= 1000)))
);
CREATE TABLE "chyme_room_members" (
	"room_id" uuid,
	"user_id" text,
	"username" text,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"role" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chyme_room_members_pkey" PRIMARY KEY("room_id","user_id"),
	CONSTRAINT "chyme_room_members_role_check" CHECK ((role = ANY (ARRAY['speaker'::text, 'listener'::text])))
);
CREATE TABLE "chyme_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"room_key" text NOT NULL CONSTRAINT "chyme_rooms_room_key_key" UNIQUE,
	"room_name" text NOT NULL,
	"call_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "chyme_service_profiles" (
	"user_id" text PRIMARY KEY,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "chyme_service_profiles_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'deleted'::text])))
);
CREATE TABLE "ctf_plugin_registry" (
	"plugin_slug" text PRIMARY KEY,
	"display_name" text NOT NULL,
	"summary" text NOT NULL,
	"availability_state" text DEFAULT 'planned' NOT NULL,
	"nav_rank" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "default_alive_or_dead_ebitda_snapshots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL CONSTRAINT "default_alive_or_dead_ebitda_snapshots_week_start_date_key" UNIQUE,
	"revenue" numeric(15, 2) NOT NULL,
	"operating_expenses" numeric(15, 2) NOT NULL,
	"depreciation" numeric(15, 2) DEFAULT '0' NOT NULL,
	"amortization" numeric(15, 2) DEFAULT '0' NOT NULL,
	"ebitda" numeric(15, 2) NOT NULL,
	"is_default_alive" boolean DEFAULT false NOT NULL,
	"projected_profitability_date" date,
	"projected_capital_needed" numeric(15, 2),
	"current_funding" numeric(15, 2),
	"growth_rate" numeric(10, 4),
	"calculation_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "default_alive_or_dead_financial_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"operating_expenses" numeric(15, 2) NOT NULL,
	"depreciation" numeric(15, 2) DEFAULT '0' NOT NULL,
	"amortization" numeric(15, 2) DEFAULT '0' NOT NULL,
	"depreciation_data" jsonb,
	"amortization_data" jsonb,
	"notes" text,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "directory_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text DEFAULT '' NOT NULL,
	"updated_by_user_id" text DEFAULT '' NOT NULL
);
CREATE TABLE "directory_deletion_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"scope" text NOT NULL,
	"plugin_id" text NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"result" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "directory_profile_change_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "directory_profile_skills" (
	"profile_id" uuid,
	"skill_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "directory_profile_skills_pkey" PRIMARY KEY("profile_id","skill_id")
);
CREATE TABLE "directory_profile_tags" (
	"profile_id" uuid,
	"tag_id" uuid,
	CONSTRAINT "directory_profile_tags_pkey" PRIMARY KEY("profile_id","tag_id")
);
CREATE TABLE "directory_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar CONSTRAINT "directory_profiles_user_id_unique" UNIQUE,
	"description" varchar(140) NOT NULL,
	"skills" text[] DEFAULT ARRAY[] NOT NULL,
	"signal_url" text,
	"quora_url" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" varchar(100),
	"sectors" text[] DEFAULT ARRAY[] NOT NULL,
	"job_titles" text[] DEFAULT ARRAY[] NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"claimed_by_user_id" text,
	"display_name" text DEFAULT '' NOT NULL,
	"headline" text,
	"bio" text,
	"profile_url" text,
	"sector_id" uuid,
	"job_title_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"venmo_address" text,
	"monero_address" text,
	"bitcoin_address" text,
	"service_credits_address" text
);
CREATE TABLE "directory_skills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL CONSTRAINT "directory_skills_name_key" UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "directory_user_extension" (
	"user_id" text PRIMARY KEY,
	"profile_visibility" text DEFAULT 'workspace' NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"venmo_address" text,
	"monero_address" text,
	"bitcoin_address" text,
	"service_credits_address" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "exclusions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"excluded_user_id" varchar NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "feed_item_targets" (
	"item_id" uuid,
	"target_role" text,
	"target_plugin" text,
	"target_region" text,
	CONSTRAINT "feed_item_targets_pkey" PRIMARY KEY("item_id","target_role","target_plugin","target_region")
);
CREATE TABLE "feed_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"item_type" text NOT NULL,
	"source_announcement_id" uuid,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "feed_membership_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"user_id" text NOT NULL,
	"plugin_id" text NOT NULL,
	"event_type" text NOT NULL,
	"request_id" text,
	"trace_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "feed_render_config" (
	"id" boolean PRIMARY KEY DEFAULT true,
	"render_mode" text NOT NULL,
	"kill_switch_enabled" boolean DEFAULT false NOT NULL,
	"max_timeline_page_size" integer DEFAULT 100 NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"singleton_key" boolean DEFAULT true
);
CREATE TABLE "feed_timeline_projection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"item_type" text NOT NULL,
	"source_announcement_id" uuid,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "feed_user_dismissals" (
	"user_id" text,
	"item_id" uuid,
	"dismissed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feed_user_dismissals_pkey" PRIMARY KEY("user_id","item_id")
);
CREATE TABLE "feed_user_read_state" (
	"user_id" text,
	"item_id" uuid,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feed_user_read_state_pkey" PRIMARY KEY("user_id","item_id")
);
CREATE TABLE "foundation_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "foundation_call_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"thread_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"modality" text NOT NULL,
	"stream_call_id" text NOT NULL,
	"requested_duration_minutes" integer DEFAULT 30 NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "foundation_capacity_policies" (
	"singleton_key" boolean PRIMARY KEY DEFAULT true,
	"max_active_threads_per_user" integer DEFAULT 20 NOT NULL,
	"max_messages_per_minute" integer DEFAULT 20 NOT NULL,
	"max_searches_per_minute" integer DEFAULT 40 NOT NULL,
	"max_quote_transitions_per_minute" integer DEFAULT 20 NOT NULL,
	"max_call_duration_minutes" integer DEFAULT 45 NOT NULL,
	"quota_state" text DEFAULT 'green' NOT NULL,
	"kill_switch_enabled" boolean DEFAULT false NOT NULL,
	"updated_by_user_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "foundation_capacity_policies_quota_state_check" CHECK ((quota_state = ANY (ARRAY['green'::text, 'yellow'::text, 'orange'::text, 'red'::text])))
);
CREATE TABLE "foundation_connection_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"thread_key" text NOT NULL CONSTRAINT "foundation_connection_threads_thread_key_key" UNIQUE,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"survivor_user_id" text,
	"provider_user_id" text,
	"stream_channel_id" text DEFAULT 'pending' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"provider_directory_profile_id" text
);
CREATE TABLE "foundation_message_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"thread_id" uuid NOT NULL UNIQUE,
	"sender_user_id" text NOT NULL UNIQUE,
	"sender_role" text NOT NULL,
	"message_text" text NOT NULL,
	"attachments" jsonb DEFAULT '[]' NOT NULL,
	"client_message_id" text NOT NULL UNIQUE,
	"stream_message_id" text,
	"moderation_status" text DEFAULT 'accepted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "foundation_message_metadata_thread_id_sender_user_id_client_key" UNIQUE("thread_id","sender_user_id","client_message_id")
);
CREATE TABLE "foundation_notification_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"thread_id" text,
	"kind" text NOT NULL,
	"title" text,
	"body" text,
	"metadata" jsonb,
	"is_acknowledged" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"quote_request_id" uuid,
	"acknowledged_at" timestamp with time zone
);
CREATE TABLE "foundation_quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"request_text" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"survivor_user_id" text,
	"provider_user_id" text,
	"service_type" text,
	"lifecycle_state" text DEFAULT 'open' NOT NULL,
	"last_transitioned_at" timestamp with time zone,
	"thread_id" uuid
);
CREATE TABLE "foundation_quote_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"quote_request_id" uuid NOT NULL,
	"actor_user_id" text NOT NULL,
	"previous_state" text,
	"current_state" text NOT NULL,
	"reason" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "foundation_rate_limit_counters" (
	"user_id" text,
	"command_name" text,
	"window_started_at" timestamp with time zone,
	"window_seconds" integer,
	"request_count" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "foundation_rate_limit_counters_pkey" PRIMARY KEY("user_id","command_name","window_started_at","window_seconds")
);
CREATE TABLE "foundation_thread_participants" (
	"thread_id" uuid,
	"user_id" text,
	"participant_role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "foundation_thread_participants_pkey" PRIMARY KEY("thread_id","user_id")
);
CREATE TABLE "foundation_user_extension" (
	"user_id" text PRIMARY KEY,
	"profile_visibility" text DEFAULT 'workspace' NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notification_preferences" jsonb DEFAULT '{}' NOT NULL,
	"accessibility_runtime_prefs" jsonb DEFAULT '{}' NOT NULL,
	"trauma_informed_defaults" jsonb DEFAULT '{}' NOT NULL
);
CREATE TABLE "gdp_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "gdp_metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"dp_suppressed" boolean DEFAULT false NOT NULL,
	"lawful_basis" text NOT NULL,
	"source_plugin" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "gdp_publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"status" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"published_by_user_id" text,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"host_user_id" text,
	CONSTRAINT "gdp_publications_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);
CREATE TABLE "gentlepulse_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "gentlepulse_favorites" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"meditation_id" varchar NOT NULL,
	"client_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text,
	"item_id" uuid
);
CREATE TABLE "gentlepulse_library_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL CONSTRAINT "gentlepulse_library_items_slug_key" UNIQUE,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"media_url" text NOT NULL,
	"support_route" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "gentlepulse_meditations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"thumbnail" varchar(500),
	"wistia_url" varchar(500) NOT NULL,
	"tags" text,
	"duration" integer,
	"play_count" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"rating_count" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "gentlepulse_mood_checks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" varchar(100) NOT NULL,
	"mood_value" integer NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "gentlepulse_play_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"anonymous_client_id" text,
	"item_id" uuid NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "gentlepulse_ratings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"meditation_id" varchar NOT NULL,
	"client_id" varchar(100) NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text,
	"item_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "invite_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" varchar(50) NOT NULL CONSTRAINT "invite_codes_code_unique" UNIQUE,
	"max_uses" integer NOT NULL,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"created_by" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "legacy_profile_redirects" (
	"plugin_slug" text,
	"scope" text,
	"legacy_entity_id" uuid,
	"current_entity_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "legacy_profile_redirects_pkey" PRIMARY KEY("plugin_slug","scope","legacy_entity_id")
);
CREATE TABLE "levelup_audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"track" text NOT NULL,
	"seats" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"required_credits" numeric NOT NULL,
	"materials_cost" numeric DEFAULT '0' NOT NULL,
	"device_support" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"allow_no_deposit" boolean DEFAULT false NOT NULL,
	"trainer_split_percent" numeric NOT NULL,
	"completion_bonus_credits" numeric DEFAULT '0' NOT NULL,
	"stipend_mode" text DEFAULT 'none' NOT NULL,
	"stipend_amount_per_payout" numeric DEFAULT '0' NOT NULL,
	"stipend_interval_days" integer,
	"microgrant_mode" text DEFAULT 'none' NOT NULL,
	"microgrant_amount" numeric DEFAULT '0' NOT NULL,
	"refund_policy_json" jsonb DEFAULT '{}' NOT NULL,
	"payout_policy_json" jsonb DEFAULT '{}' NOT NULL,
	"policy_json" jsonb DEFAULT '{}' NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_command_idempotency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL UNIQUE,
	"command_name" text NOT NULL UNIQUE,
	"idempotency_key" text NOT NULL UNIQUE,
	"response_payload" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levelup_command_idempotency_actor_id_command_name_idempoten_key" UNIQUE("actor_id","command_name","idempotency_key")
);
CREATE TABLE "levelup_curriculum_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"sequence_no" integer NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_disbursements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"enrollment_id" uuid NOT NULL,
	"recipient_user_id" text NOT NULL,
	"disbursement_type" text DEFAULT 'trainer_payout' NOT NULL,
	"amount" numeric NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_dispute_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"dispute_id" uuid NOT NULL,
	"actor_user_id" text NOT NULL,
	"body" text NOT NULL,
	"attachment_urls" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"enrollment_id" uuid NOT NULL,
	"milestone_id" uuid,
	"opened_by_user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"resolution_comment" text,
	"resolved_by_user_id" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_enrollment_milestone_escrows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"enrollment_id" uuid NOT NULL UNIQUE,
	"milestone_id" uuid NOT NULL UNIQUE,
	"escrow_id" uuid NOT NULL,
	"held_amount" numeric NOT NULL,
	"release_status" text DEFAULT 'held' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levelup_enrollment_milestone_esc_enrollment_id_milestone_id_key" UNIQUE("enrollment_id","milestone_id")
);
CREATE TABLE "levelup_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"level_id" text NOT NULL UNIQUE,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"cohort_id" uuid NOT NULL,
	"credits_deposited" integer DEFAULT 0 NOT NULL,
	"assigned_trainer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"progress_percent" numeric DEFAULT '0' NOT NULL,
	CONSTRAINT "levelup_enrollments_user_id_level_id_key" UNIQUE("user_id","level_id")
);
CREATE TABLE "levelup_milestone_validations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"enrollment_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	"validated_by_user_id" text,
	"validation_note" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"release_transfer_id" uuid,
	"trainer_payout_governance_id" uuid,
	"released_at" timestamp with time zone,
	"validated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid NOT NULL,
	"name" text NOT NULL,
	"percent_release" numeric NOT NULL,
	"required_task" text NOT NULL,
	"sequence_no" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "levelup_rate_limit_counters" (
	"user_id" text,
	"command_name" text,
	"window_started_at" timestamp with time zone,
	"window_seconds" integer,
	"request_count" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levelup_rate_limit_counters_pkey" PRIMARY KEY("user_id","command_name","window_started_at","window_seconds")
);
CREATE TABLE "lighthouse_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lighthouse_admin_audit_trail_policy_status_check" CHECK ((policy_status = ANY (ARRAY['allow'::text, 'deny'::text])))
);
CREATE TABLE "lighthouse_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "lighthouse_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"blocker_user_id" text NOT NULL UNIQUE,
	"blocked_user_id" text NOT NULL UNIQUE,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lighthouse_blocks_blocker_user_id_blocked_user_id_key" UNIQUE("blocker_user_id","blocked_user_id"),
	CONSTRAINT "lighthouse_blocks_check" CHECK ((blocker_user_id <> blocked_user_id))
);
CREATE TABLE "lighthouse_matches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"seeker_id" varchar NOT NULL,
	"property_id" varchar NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"proposed_move_in_date" timestamp,
	"actual_move_in_date" timestamp,
	"proposed_move_out_date" timestamp,
	"actual_move_out_date" timestamp,
	"seeker_message" text,
	"host_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"seeker_user_id" text,
	"host_user_id" text,
	"message" text,
	"stream_channel_id" text DEFAULT 'pending' NOT NULL
);
CREATE TABLE "lighthouse_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL CONSTRAINT "lighthouse_profiles_user_id_unique" UNIQUE,
	"profile_type" varchar(20) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"bio" text,
	"phone_number" varchar(20),
	"housing_needs" text,
	"move_in_date" timestamp,
	"budget_min" numeric(10, 2),
	"budget_max" numeric(10, 2),
	"has_property" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"signal_url" text,
	"desired_country" varchar(100),
	"desired_move_in_date" date,
	"service_deleted_at" timestamp with time zone
);
CREATE TABLE "lighthouse_properties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"host_id" varchar NOT NULL,
	"property_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50),
	"zip_code" varchar(10) NOT NULL,
	"bedrooms" integer,
	"bathrooms" numeric(3, 1),
	"amenities" text[],
	"house_rules" text,
	"monthly_rent" numeric(10, 2) NOT NULL,
	"security_deposit" numeric(10, 2),
	"available_from" timestamp,
	"available_until" timestamp,
	"max_occupants" integer DEFAULT 1,
	"photos" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"airbnb_profile_url" text,
	"country" varchar(100),
	"host_user_id" text,
	"address_line" text,
	"created_by_user_id" text,
	"updated_by_user_id" text
);
CREATE TABLE "lighthouse_user_extension" (
	"user_id" text PRIMARY KEY,
	"service_deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "login_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"source" varchar(50) DEFAULT 'webapp' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"partnership_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "moderation_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"reporter_id" varchar NOT NULL,
	"reported_user_id" varchar,
	"source" varchar(50) NOT NULL,
	"source_id" varchar,
	"channel_id" varchar,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"resolution" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notified_at" timestamp with time zone
);
CREATE TABLE "mood_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "mood_checks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"client_id" varchar(100) NOT NULL,
	"mood_value" integer NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "mood_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"client_id" text NOT NULL,
	"mood_value" integer NOT NULL,
	"note" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "nps_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"score" integer NOT NULL,
	"response_month" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"feedback" text
);
CREATE TABLE "otp_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"code" varchar(16) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "partnerships" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user1_id" varchar NOT NULL,
	"user2_id" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" timestamp NOT NULL,
	"payment_method" varchar(50) DEFAULT 'cash' NOT NULL,
	"notes" text,
	"recorded_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"billing_period" varchar(20) DEFAULT 'monthly' NOT NULL,
	"billing_month" varchar(7),
	"yearly_start_month" varchar(7),
	"yearly_end_month" varchar(7)
);
CREATE TABLE "peer_programming_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "peer_programming_assignment_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid NOT NULL,
	"user_id" text NOT NULL UNIQUE,
	"idempotency_key" text NOT NULL UNIQUE,
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"delivered_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "peer_programming_assignment_notific_user_id_idempotency_key_key" UNIQUE("user_id","idempotency_key")
);
CREATE TABLE "peer_programming_cohort_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid NOT NULL UNIQUE,
	"user_id" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "peer_programming_cohort_members_cohort_id_user_id_key" UNIQUE("cohort_id","user_id")
);
CREATE TABLE "peer_programming_cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL UNIQUE,
	"cohort_label" text NOT NULL UNIQUE,
	"fallback_open" boolean DEFAULT false NOT NULL,
	"topic_id" uuid,
	"assigned_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "peer_programming_cohorts_week_start_date_cohort_label_key" UNIQUE("week_start_date","cohort_label")
);
CREATE TABLE "peer_programming_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid,
	"user_id" text NOT NULL,
	"issue_type" text NOT NULL,
	"suggestion_category" text NOT NULL,
	"release_surface" text NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "peer_programming_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"cohort_id" uuid NOT NULL,
	"author_user_id" text NOT NULL,
	"parent_message_id" uuid,
	"body" text NOT NULL,
	"tier" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "peer_programming_weekly_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"topic" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"guidance" text NOT NULL,
	"revision_note" text,
	"status" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"published_by_user_id" text,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "peer_programming_weekly_topics_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);
CREATE TABLE "pricing_tiers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"amount" numeric(10, 2) NOT NULL,
	"effective_date" timestamp DEFAULT now() NOT NULL,
	"is_current_tier" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "profile_deletion_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"app_name" varchar(50) NOT NULL,
	"deleted_at" timestamp DEFAULT now() NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"reporter_id" varchar NOT NULL,
	"reported_user_id" varchar NOT NULL,
	"partnership_id" varchar,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolution" text
);
CREATE TABLE "service_credits_account_deletion_reclaims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"amount_transferred" numeric NOT NULL,
	"transfer_id" uuid,
	"tombstone_id" uuid,
	"provider_transaction_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text,
	"deletion_request_id" uuid,
	"treasury_user_id" text,
	"request_id" text,
	"trace_id" text,
	"actor_id" text,
	"idempotency_key" text
);
CREATE TABLE "service_credits_adapter_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"provider_transaction_id" text,
	"command_name" text,
	"idempotency_key" text,
	"provider" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"last_error" text,
	"attempt_count" integer DEFAULT 0 NOT NULL
);
CREATE TABLE "service_credits_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_command_idempotency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"command" text NOT NULL,
	"response_payload" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" text,
	"command_name" text,
	"idempotency_key" text
);
CREATE TABLE "service_credits_dispute_adjustments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"dispute_id" uuid NOT NULL,
	"adjustment_amount" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" text,
	"adjustment_reason" text,
	"amount" numeric,
	"destination_user_id" text,
	"dispute_case_id" uuid,
	"idempotency_key" text,
	"provider_transaction_id" text,
	"source_user_id" text,
	"transfer_id" uuid
);
CREATE TABLE "service_credits_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"transfer_id" uuid NOT NULL,
	"opened_by_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_escrow_holds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"wallet_user_id" text NOT NULL,
	"transfer_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_governance_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_type" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" text,
	"amount" numeric,
	"governance_ticket_id" uuid,
	"idempotency_key" text,
	"provider_transaction_id" text,
	"reason" text,
	"target_user_id" text
);
CREATE TABLE "service_credits_ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"entry_type" text NOT NULL,
	"amount" numeric NOT NULL,
	"reference_type" text NOT NULL,
	"reference_id" text NOT NULL,
	"accounting_scope" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sender_user_id" text NOT NULL,
	"recipient_user_id" text NOT NULL,
	"amount" numeric NOT NULL,
	"status" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_treasury_config" (
	"id" boolean PRIMARY KEY DEFAULT true,
	"policy" jsonb DEFAULT '{}' NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "service_credits_treasury_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_type" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" text,
	"amount" numeric,
	"idempotency_key" text,
	"provider_transaction_id" text,
	"reason_code" text,
	"source_user_id" text,
	"transfer_id" uuid,
	"treasury_user_id" text
);
CREATE TABLE "service_credits_wallet_tombstones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"final_available_balance" numeric NOT NULL,
	"final_escrow_balance" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text,
	"deletion_request_id" uuid
);
CREATE TABLE "service_credits_wallets" (
	"user_id" text PRIMARY KEY,
	"available_balance" numeric DEFAULT '0' NOT NULL,
	"escrow_balance" numeric DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
CREATE TABLE "skills_hunt_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"code" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"awarded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_achievements_user_id_code_key" UNIQUE("user_id","code")
);
CREATE TABLE "skills_hunt_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_audit_log_policy_status_check" CHECK ((policy_status = ANY (ARRAY['allow'::text, 'deny'::text])))
);
CREATE TABLE "skills_hunt_directory_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"submission_id" uuid NOT NULL CONSTRAINT "skills_hunt_directory_profiles_submission_id_key" UNIQUE,
	"directory_profile_id" text NOT NULL CONSTRAINT "skills_hunt_directory_profiles_directory_profile_id_key" UNIQUE,
	"invited_by_username" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_hunt_feature_reward_card" (
	"singleton_key" boolean PRIMARY KEY DEFAULT true,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cta_label" text NOT NULL,
	"cta_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_hunt_leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"round_id" uuid NOT NULL UNIQUE,
	"mode" text NOT NULL UNIQUE,
	"rank" integer NOT NULL UNIQUE,
	"score" integer NOT NULL,
	"accepted_count" integer DEFAULT 0 NOT NULL,
	"rare_skill_bonus" integer DEFAULT 0 NOT NULL,
	"user_id" text,
	"username_snapshot" text,
	"team_key" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_leaderboard_round_id_mode_rank_key" UNIQUE("round_id","mode","rank"),
	CONSTRAINT "skills_hunt_leaderboard_mode_check" CHECK ((mode = ANY (ARRAY['individual'::text, 'team'::text])))
);
CREATE TABLE "skills_hunt_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_hunt_rare_skills_lookup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"round_id" uuid NOT NULL UNIQUE,
	"skill_name" text NOT NULL UNIQUE,
	"bonus_points" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_rare_skills_lookup_round_id_skill_name_key" UNIQUE("round_id","skill_name")
);
CREATE TABLE "skills_hunt_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"scoring_config" jsonb DEFAULT '{}' NOT NULL,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_rounds_check" CHECK ((ends_at > starts_at)),
	CONSTRAINT "skills_hunt_rounds_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'closed'::text, 'archived'::text])))
);
CREATE TABLE "skills_hunt_service_credits_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"reason" text,
	"submission_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_service_credits_transactions_amount_check" CHECK ((amount > 0))
);
CREATE TABLE "skills_hunt_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"round_id" uuid NOT NULL UNIQUE,
	"submitter_user_id" text NOT NULL,
	"submitter_username" text,
	"display_name" text NOT NULL,
	"bio" text NOT NULL,
	"quora_profile_url" text NOT NULL,
	"quora_profile_url_normalized" text NOT NULL,
	"skills" jsonb DEFAULT '[]' NOT NULL,
	"claimed_professions" jsonb DEFAULT '[]' NOT NULL,
	"signature_hash" text NOT NULL UNIQUE,
	"status" text DEFAULT 'pending' NOT NULL,
	"review_action" text,
	"reviewed_by_user_id" text,
	"review_notes" text,
	"score_breakdown" jsonb DEFAULT '{}' NOT NULL,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"reviewed_at" timestamp with time zone,
	"directory_profile_generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_hunt_submissions_round_id_signature_hash_key" UNIQUE("round_id","signature_hash"),
	CONSTRAINT "skills_hunt_submissions_review_action_check" CHECK ((review_action = ANY (ARRAY['accept'::text, 'reject'::text, 'edit'::text, 'flag'::text]))),
	CONSTRAINT "skills_hunt_submissions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'flagged'::text])))
);
CREATE TABLE "skills_job_titles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"sector_id" varchar NOT NULL,
	"name" varchar(200) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "skills_sectors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL CONSTRAINT "skills_sectors_name_key" UNIQUE,
	"estimated_workforce_share" numeric(5, 2),
	"estimated_workforce_count" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "skills_skills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"job_title_id" varchar NOT NULL,
	"name" varchar(200) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_change_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"action" text NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_taxonomy_change_events_action_check" CHECK ((action = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'preview'::text]))),
	CONSTRAINT "skills_taxonomy_change_events_target_type_check" CHECK ((target_type = ANY (ARRAY['sector'::text, 'job-title'::text, 'skill'::text])))
);
CREATE TABLE "skills_taxonomy_consumer_bindings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"consumer_name" text NOT NULL UNIQUE,
	"target_type" text NOT NULL UNIQUE,
	"target_id" uuid NOT NULL UNIQUE,
	"reference_count" integer DEFAULT 1 NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consumer_plugin" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_taxonomy_consumer_bind_consumer_name_target_type_tar_key" UNIQUE("consumer_name","target_type","target_id"),
	CONSTRAINT "skills_taxonomy_consumer_bindings_reference_count_check" CHECK ((reference_count >= 0)),
	CONSTRAINT "skills_taxonomy_consumer_bindings_target_type_check" CHECK ((target_type = ANY (ARRAY['sector'::text, 'job-title'::text, 'skill'::text])))
);
CREATE TABLE "skills_taxonomy_deletion_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"scope" text NOT NULL,
	"plugin_id" text DEFAULT 'skills-taxonomy' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"result" text NOT NULL,
	"request_id" text,
	"trace_id" text,
	CONSTRAINT "skills_taxonomy_deletion_events_result_check" CHECK ((result = ANY (ARRAY['requested'::text, 'processing'::text, 'completed'::text, 'failed'::text]))),
	CONSTRAINT "skills_taxonomy_deletion_events_scope_check" CHECK ((scope = ANY (ARRAY['service'::text, 'account'::text])))
);
CREATE TABLE "skills_taxonomy_flattened_projection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sector_id" uuid NOT NULL,
	"sector_name" text NOT NULL,
	"job_title_id" uuid NOT NULL,
	"job_title_name" text NOT NULL,
	"skill_id" uuid NOT NULL,
	"skill_name" text NOT NULL,
	"skill_aliases" jsonb DEFAULT '[]' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_job_titles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sector_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"workforce_share" numeric(6, 3),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_skill_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"skill_id" uuid NOT NULL UNIQUE,
	"value" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_taxonomy_skill_votes_user_id_skill_id_key" UNIQUE("user_id","skill_id"),
	CONSTRAINT "skills_taxonomy_skill_votes_value_check" CHECK ((value = ANY (ARRAY['-1'::integer, 1])))
);
CREATE TABLE "skills_taxonomy_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"job_title_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"aliases" jsonb DEFAULT '[]' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_user_extension" (
	"user_id" text PRIMARY KEY,
	"skill_visibility_preferences" jsonb DEFAULT '{}' NOT NULL,
	"endorsement_opt_in" boolean DEFAULT true NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "skills_taxonomy_user_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"skill_id" uuid NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_taxonomy_user_skills_user_id_skill_id_key" UNIQUE("user_id","skill_id")
);
CREATE TABLE "socketrelay_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "socketrelay_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "socketrelay_fulfillment_participants" (
	"fulfillment_id" uuid,
	"user_id" text,
	"participant_role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "socketrelay_fulfillment_participants_pkey" PRIMARY KEY("fulfillment_id","user_id")
);
CREATE TABLE "socketrelay_fulfillments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" varchar NOT NULL,
	"fulfiller_user_id" varchar NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"closed_by" varchar,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"requester_user_id" text DEFAULT '' NOT NULL,
	"close_reason" text
);
CREATE TABLE "socketrelay_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"fulfillment_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sender_user_id" text DEFAULT '' NOT NULL,
	"message_text" text DEFAULT '' NOT NULL,
	"moderation_status" text DEFAULT 'accepted' NOT NULL,
	"client_message_id" text
);
CREATE TABLE "socketrelay_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL CONSTRAINT "socketrelay_profiles_user_id_unique" UNIQUE,
	"display_name" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"country" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
CREATE TABLE "socketrelay_request_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"actor_user_id" text NOT NULL,
	"event_name" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "socketrelay_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL,
	"description" varchar(140) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"owner_user_id" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"city" text,
	"reopened_count" integer DEFAULT 0 NOT NULL,
	"claimed_fulfillment_id" uuid,
	"idempotency_key" text DEFAULT '' NOT NULL
);
CREATE TABLE "socketrelay_user_extension" (
	"user_id" text PRIMARY KEY,
	"display_name" text,
	"bio" text,
	"relay_preferences" jsonb DEFAULT '{}' NOT NULL,
	"presence_opt_in" boolean DEFAULT false NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "support_match_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL CONSTRAINT "support_match_profiles_user_id_unique" UNIQUE,
	"nickname" varchar(100),
	"gender" varchar(50),
	"gender_preference" varchar(50),
	"timezone" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"timezone_preference" varchar(50) DEFAULT 'same_timezone' NOT NULL,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"is_verified" boolean DEFAULT false NOT NULL
);
CREATE TABLE "supportmatch_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "trust_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_user_id" text,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_user_id" text,
	"request_id" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trust_user_extension" (
	"user_id" text PRIMARY KEY,
	"trust_status" text DEFAULT 'unverified' NOT NULL,
	"trust_evidence" jsonb DEFAULT '[]' NOT NULL,
	"trust_visibility" text DEFAULT 'public' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid,
	"request_id" uuid,
	"opened_by_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolution_notes" text,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" text
);
CREATE TABLE "trusttransport_earnings_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"provider_user_id" text NOT NULL,
	"entry_type" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_market_config" (
	"id" boolean PRIMARY KEY DEFAULT true,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"provider_user_id" text NOT NULL,
	"note" text,
	"proposed_amount" integer,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_payout_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"provider_user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" text,
	"decision_reason" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL CONSTRAINT "trusttransport_profiles_user_id_unique" UNIQUE,
	"display_name" varchar(100) NOT NULL,
	"is_driver" boolean DEFAULT false NOT NULL,
	"is_rider" boolean DEFAULT true NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"country" varchar(100) NOT NULL,
	"vehicle_make" varchar(100),
	"vehicle_model" varchar(100),
	"vehicle_year" integer,
	"vehicle_color" varchar(50),
	"license_plate" varchar(20),
	"bio" text,
	"phone_number" varchar(20),
	"signal_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
CREATE TABLE "trusttransport_proof_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"artifact_type" text NOT NULL,
	"artifact_redacted" text,
	"captured_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"requester_user_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"score" integer NOT NULL,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"requester_user_id" text NOT NULL,
	"mode" text NOT NULL,
	"title" text NOT NULL,
	"details" text,
	"pickup_city" text,
	"dropoff_city" text,
	"pickup_geo_redacted" text,
	"dropoff_geo_redacted" text,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"idempotency_key" text
);
CREATE TABLE "trusttransport_ride_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"rider_id" varchar NOT NULL,
	"driver_id" varchar,
	"pickup_location" text NOT NULL,
	"dropoff_location" text NOT NULL,
	"pickup_city" varchar(100) NOT NULL,
	"pickup_state" varchar(100),
	"dropoff_city" varchar(100) NOT NULL,
	"dropoff_state" varchar(100),
	"departure_date_time" timestamp NOT NULL,
	"requested_seats" integer DEFAULT 1 NOT NULL,
	"requested_car_type" varchar(50),
	"requires_heat" boolean DEFAULT false NOT NULL,
	"requires_ac" boolean DEFAULT false NOT NULL,
	"requires_wheelchair_access" boolean DEFAULT false NOT NULL,
	"requires_child_seat" boolean DEFAULT false NOT NULL,
	"rider_message" text,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"driver_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_risk_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid,
	"trip_id" uuid,
	"actor_user_id" text NOT NULL,
	"target_user_id" text,
	"signal_type" text NOT NULL,
	"severity" text,
	"notes" text,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"resolved_by_user_id" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"trip_id" uuid,
	"actor_user_id" text NOT NULL,
	"event_name" text NOT NULL,
	"from_status" text,
	"to_status" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"offer_id" uuid,
	"requester_user_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"mode" text NOT NULL,
	"status" text NOT NULL,
	"stream_channel_id" text,
	"cancelled_reason" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "trusttransport_user_extension" (
	"user_id" text PRIMARY KEY,
	"availability_preferences" jsonb DEFAULT '{}' NOT NULL,
	"work_preferences" jsonb DEFAULT '{}' NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_restricted" boolean DEFAULT false NOT NULL,
	"restricted_at" timestamp with time zone,
	"restricted_by_user_id" text,
	"restriction_reason" text,
	"mode_preferences" jsonb DEFAULT '{}' NOT NULL,
	"safety_settings" jsonb DEFAULT '{}' NOT NULL,
	"payout_preferences" jsonb DEFAULT '{}' NOT NULL,
	"provider_eligible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "unlock_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"details" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" text,
	"command" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"policy_status" text,
	"reason" text,
	"request_id" text,
	"target_user_id" text
);
CREATE TABLE "unlock_runtime_config" (
	"singleton_id" integer PRIMARY KEY DEFAULT 1,
	"submission_window_hours" integer DEFAULT 168 NOT NULL,
	"reminder_schedule_hours" integer[] DEFAULT ARRAY[0, 24, 72, 168] NOT NULL,
	"incentive_amount" text DEFAULT '100' NOT NULL,
	"support_only_after_expiry" boolean DEFAULT true NOT NULL
);
CREATE TABLE "unlock_verification_submissions" (
	"user_id" text PRIMARY KEY,
	"access_tier" text NOT NULL,
	"incentive_granted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" serial,
	"quora_profile_url" text NOT NULL,
	"quora_profile_url_normalized" text NOT NULL,
	"review_status" text NOT NULL,
	"unlock_window_expires_at" timestamp with time zone NOT NULL,
	"reminder_stage" integer DEFAULT 0 NOT NULL,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unlock_verification_submissions_review_status_check" CHECK ((review_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'spam'::text])))
);
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar CONSTRAINT "users_email_unique" UNIQUE,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"is_admin" boolean DEFAULT false NOT NULL,
	"pricing_tier" numeric(10, 2) DEFAULT '1.00' NOT NULL,
	"subscription_status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"terms_accepted_at" timestamp,
	"quora_profile_url" varchar,
	"username" varchar(64),
	CONSTRAINT "users_username_not_blank_chk" CHECK (((username IS NULL) OR (btrim((username)::text) <> ''::text)))
);
CREATE TABLE "waitlist_signups" (
	"id" serial PRIMARY KEY,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"skills" text NOT NULL,
	"country" text NOT NULL,
	"state" text,
	"city" text,
	"quora_profile_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_signups_skills_check" CHECK ((char_length(skills) <= 240))
);
CREATE TABLE "weekly_performance_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "weekly_performance_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"metric_unit" text NOT NULL,
	"source_plugin" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "weekly_performance_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"week_start_date" date NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"selected_by_user_id" text,
	"selected_at" timestamp with time zone
);
CREATE TABLE "workforce_admin_audit_trail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" text NOT NULL,
	"command" text NOT NULL,
	"policy_status" text NOT NULL,
	"reason" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"body" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_config" (
	"singleton_key" boolean PRIMARY KEY DEFAULT true,
	"exports_enabled" boolean DEFAULT false NOT NULL,
	"kill_switch_enabled" boolean DEFAULT false NOT NULL,
	"report_week_timezone" text NOT NULL,
	"report_week_start_dow" integer DEFAULT 0 NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_export_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_by_user_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"export_type" text NOT NULL,
	"export_data" jsonb DEFAULT '{}' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_occupations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"sector" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" text NOT NULL,
	"updated_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_profiles" (
	"user_id" text PRIMARY KEY,
	"occupation_id" uuid NOT NULL,
	"skill_level" text NOT NULL,
	"region" text NOT NULL,
	"recruited_state" boolean DEFAULT false NOT NULL,
	"recruited_resolved_at" timestamp with time zone,
	"updated_by_user_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruited_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"directory_profile_id" text,
	"inference_dedupe_key" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_recruited" boolean,
	"source_event" text
);
CREATE TABLE "workforce_recruited_sync_cursor" (
	"singleton_key" boolean PRIMARY KEY DEFAULT true,
	"last_cursor_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"population" integer DEFAULT 5000000 NOT NULL,
	"workforce_participation_rate" numeric(5, 4) DEFAULT '0.5' NOT NULL,
	"min_recruitable" integer DEFAULT 2000000 NOT NULL,
	"max_recruitable" integer DEFAULT 5000000 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_meetup_event_signups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"location" varchar(200) NOT NULL,
	"preferred_meetup_date" date,
	"availability" text[] DEFAULT ARRAY[] NOT NULL,
	"why_interested" text,
	"additional_comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_meetup_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"occupation_id" varchar NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"created_by" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_occupations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"sector_id" varchar,
	"job_title_id" varchar,
	"sector" varchar(100),
	"occupation_title" varchar(200),
	"headcount_target" integer NOT NULL,
	"skill_level" varchar(20) NOT NULL,
	"annual_training_target" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_recruiter_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" varchar NOT NULL CONSTRAINT "workforce_recruiter_profiles_user_id_key" UNIQUE,
	"display_name" varchar(100),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
CREATE TABLE "workforce_recruiter_recruitment_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"occupation_id" varchar NOT NULL,
	"date" date NOT NULL,
	"count" integer NOT NULL,
	"source" varchar(50) NOT NULL,
	"notes" text,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "workforce_user_extension" (
	"user_id" text PRIMARY KEY,
	"availability_preferences" jsonb DEFAULT '{}' NOT NULL,
	"work_preferences" jsonb DEFAULT '{}' NOT NULL,
	"service_deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "_system"."replit_database_migrations_v1" (
	"id" bigserial PRIMARY KEY,
	"build_id" text NOT NULL,
	"deployment_id" text NOT NULL,
	"statement_count" bigint NOT NULL,
	"applied_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "admin_action_logs_pkey" ON "admin_action_logs" ("id");
CREATE UNIQUE INDEX "announcement_delivery_events_pkey" ON "announcement_delivery_events" ("id");
CREATE UNIQUE INDEX "announcement_membership_events_pkey" ON "announcement_membership_events" ("id");
CREATE UNIQUE INDEX "announcement_revisions_pkey" ON "announcement_revisions" ("id");
CREATE UNIQUE INDEX "announcement_user_state_pkey" ON "announcement_user_state" ("user_id","announcement_id");
CREATE UNIQUE INDEX "announcements_pkey" ON "announcements" ("id");
CREATE INDEX "idx_announcements_status" ON "announcements" ("status");
CREATE UNIQUE INDEX "auth_tokens_pkey" ON "auth_tokens" ("id");
CREATE UNIQUE INDEX "auth_tokens_token_key" ON "auth_tokens" ("token");
CREATE INDEX "idx_auth_tokens_expires_at" ON "auth_tokens" ("expires_at");
CREATE INDEX "idx_auth_tokens_token" ON "auth_tokens" ("token");
CREATE INDEX "idx_auth_tokens_user_id" ON "auth_tokens" ("user_id");
CREATE UNIQUE INDEX "chat_groups_pkey" ON "chat_groups" ("id");
CREATE UNIQUE INDEX "chat_messages_pkey" ON "chat_messages" ("id");
CREATE INDEX "idx_chat_messages_channel_created" ON "chat_messages" ("channel_id","created_at");
CREATE INDEX "idx_chat_messages_user_id" ON "chat_messages" ("user_id");
CREATE UNIQUE INDEX "chatgroups_announcements_pkey" ON "chatgroups_announcements" ("id");
CREATE UNIQUE INDEX "chyme_deletion_events_pkey" ON "chyme_deletion_events" ("id");
CREATE INDEX "idx_chyme_deletion_events_user_scope" ON "chyme_deletion_events" ("user_id","scope","requested_at");
CREATE UNIQUE INDEX "chyme_messages_pkey" ON "chyme_messages" ("id");
CREATE INDEX "idx_chyme_messages_room_sent_at" ON "chyme_messages" ("room_id","sent_at");
CREATE INDEX "idx_chyme_messages_user_id" ON "chyme_messages" ("user_id");
CREATE UNIQUE INDEX "chyme_room_members_pkey" ON "chyme_room_members" ("room_id","user_id");
CREATE INDEX "idx_chyme_room_members_room_id" ON "chyme_room_members" ("room_id");
CREATE INDEX "idx_chyme_room_members_user_id" ON "chyme_room_members" ("user_id");
CREATE UNIQUE INDEX "chyme_rooms_pkey" ON "chyme_rooms" ("id");
CREATE UNIQUE INDEX "chyme_rooms_room_key_key" ON "chyme_rooms" ("room_key");
CREATE UNIQUE INDEX "uq_chyme_rooms_room_key" ON "chyme_rooms" ("room_key");
CREATE UNIQUE INDEX "chyme_service_profiles_pkey" ON "chyme_service_profiles" ("user_id");
CREATE UNIQUE INDEX "ctf_plugin_registry_pkey" ON "ctf_plugin_registry" ("plugin_slug");
CREATE UNIQUE INDEX "default_alive_or_dead_ebitda_snapshots_pkey" ON "default_alive_or_dead_ebitda_snapshots" ("id");
CREATE UNIQUE INDEX "default_alive_or_dead_ebitda_snapshots_week_start_date_key" ON "default_alive_or_dead_ebitda_snapshots" ("week_start_date");
CREATE UNIQUE INDEX "default_alive_or_dead_financial_entries_pkey" ON "default_alive_or_dead_financial_entries" ("id");
CREATE UNIQUE INDEX "directory_announcements_pkey" ON "directory_announcements" ("id");
CREATE UNIQUE INDEX "directory_deletion_events_pkey" ON "directory_deletion_events" ("id");
CREATE UNIQUE INDEX "directory_profile_change_events_pkey" ON "directory_profile_change_events" ("id");
CREATE UNIQUE INDEX "directory_profile_skills_pkey" ON "directory_profile_skills" ("profile_id","skill_id");
CREATE UNIQUE INDEX "directory_profile_tags_pkey" ON "directory_profile_tags" ("profile_id","tag_id");
CREATE UNIQUE INDEX "directory_profiles_pkey" ON "directory_profiles" ("id");
CREATE UNIQUE INDEX "directory_profiles_user_id_unique" ON "directory_profiles" ("user_id");
CREATE INDEX "idx_directory_profiles_coordinates" ON "directory_profiles" ("latitude","longitude");
CREATE UNIQUE INDEX "directory_skills_name_key" ON "directory_skills" ("name");
CREATE UNIQUE INDEX "directory_skills_pkey" ON "directory_skills" ("id");
CREATE UNIQUE INDEX "directory_user_extension_pkey" ON "directory_user_extension" ("user_id");
CREATE UNIQUE INDEX "exclusions_pkey" ON "exclusions" ("id");
CREATE UNIQUE INDEX "feed_item_targets_pkey" ON "feed_item_targets" ("item_id","target_role","target_plugin","target_region");
CREATE UNIQUE INDEX "feed_items_pkey" ON "feed_items" ("id");
CREATE UNIQUE INDEX "feed_membership_events_pkey" ON "feed_membership_events" ("id");
CREATE UNIQUE INDEX "feed_render_config_pkey" ON "feed_render_config" ("id");
CREATE UNIQUE INDEX "feed_timeline_projection_pkey" ON "feed_timeline_projection" ("id");
CREATE UNIQUE INDEX "feed_user_dismissals_pkey" ON "feed_user_dismissals" ("user_id","item_id");
CREATE UNIQUE INDEX "feed_user_read_state_pkey" ON "feed_user_read_state" ("user_id","item_id");
CREATE UNIQUE INDEX "foundation_admin_audit_trail_pkey" ON "foundation_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "foundation_call_sessions_pkey" ON "foundation_call_sessions" ("id");
CREATE UNIQUE INDEX "foundation_capacity_policies_pkey" ON "foundation_capacity_policies" ("singleton_key");
CREATE UNIQUE INDEX "foundation_connection_threads_pkey" ON "foundation_connection_threads" ("id");
CREATE UNIQUE INDEX "foundation_connection_threads_thread_key_key" ON "foundation_connection_threads" ("thread_key");
CREATE UNIQUE INDEX "foundation_message_metadata_pkey" ON "foundation_message_metadata" ("id");
CREATE UNIQUE INDEX "foundation_message_metadata_thread_id_sender_user_id_client_key" ON "foundation_message_metadata" ("thread_id","sender_user_id","client_message_id");
CREATE UNIQUE INDEX "foundation_notification_events_pkey" ON "foundation_notification_events" ("id");
CREATE UNIQUE INDEX "foundation_quote_requests_pkey" ON "foundation_quote_requests" ("id");
CREATE UNIQUE INDEX "foundation_quote_status_events_pkey" ON "foundation_quote_status_events" ("id");
CREATE UNIQUE INDEX "foundation_rate_limit_counters_pkey" ON "foundation_rate_limit_counters" ("user_id","command_name","window_started_at","window_seconds");
CREATE UNIQUE INDEX "foundation_thread_participants_pkey" ON "foundation_thread_participants" ("thread_id","user_id");
CREATE UNIQUE INDEX "foundation_user_extension_pkey" ON "foundation_user_extension" ("user_id");
CREATE UNIQUE INDEX "gdp_admin_audit_trail_pkey" ON "gdp_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "gdp_metric_snapshots_pkey" ON "gdp_metric_snapshots" ("id");
CREATE UNIQUE INDEX "gdp_publications_pkey" ON "gdp_publications" ("id");
CREATE UNIQUE INDEX "gentlepulse_announcements_pkey" ON "gentlepulse_announcements" ("id");
CREATE UNIQUE INDEX "gentlepulse_favorites_pkey" ON "gentlepulse_favorites" ("id");
CREATE UNIQUE INDEX "gentlepulse_library_items_pkey" ON "gentlepulse_library_items" ("id");
CREATE UNIQUE INDEX "gentlepulse_library_items_slug_key" ON "gentlepulse_library_items" ("slug");
CREATE UNIQUE INDEX "gentlepulse_meditations_pkey" ON "gentlepulse_meditations" ("id");
CREATE UNIQUE INDEX "gentlepulse_mood_checks_pkey" ON "gentlepulse_mood_checks" ("id");
CREATE UNIQUE INDEX "gentlepulse_play_events_pkey" ON "gentlepulse_play_events" ("id");
CREATE UNIQUE INDEX "gentlepulse_ratings_pkey" ON "gentlepulse_ratings" ("id");
CREATE UNIQUE INDEX "invite_codes_code_unique" ON "invite_codes" ("code");
CREATE UNIQUE INDEX "invite_codes_pkey" ON "invite_codes" ("id");
CREATE UNIQUE INDEX "legacy_profile_redirects_pkey" ON "legacy_profile_redirects" ("plugin_slug","scope","legacy_entity_id");
CREATE UNIQUE INDEX "levelup_audit_events_pkey" ON "levelup_audit_events" ("id");
CREATE UNIQUE INDEX "levelup_cohorts_pkey" ON "levelup_cohorts" ("id");
CREATE UNIQUE INDEX "levelup_command_idempotency_actor_id_command_name_idempoten_key" ON "levelup_command_idempotency" ("actor_id","command_name","idempotency_key");
CREATE UNIQUE INDEX "levelup_command_idempotency_pkey" ON "levelup_command_idempotency" ("id");
CREATE UNIQUE INDEX "levelup_curriculum_items_pkey" ON "levelup_curriculum_items" ("id");
CREATE UNIQUE INDEX "levelup_disbursements_pkey" ON "levelup_disbursements" ("id");
CREATE UNIQUE INDEX "levelup_dispute_comments_pkey" ON "levelup_dispute_comments" ("id");
CREATE UNIQUE INDEX "levelup_disputes_pkey" ON "levelup_disputes" ("id");
CREATE UNIQUE INDEX "levelup_enrollment_milestone_esc_enrollment_id_milestone_id_key" ON "levelup_enrollment_milestone_escrows" ("enrollment_id","milestone_id");
CREATE UNIQUE INDEX "levelup_enrollment_milestone_escrows_pkey" ON "levelup_enrollment_milestone_escrows" ("id");
CREATE UNIQUE INDEX "levelup_enrollments_cohort_id_user_id_key" ON "levelup_enrollments" ("cohort_id","user_id");
CREATE UNIQUE INDEX "levelup_enrollments_pkey" ON "levelup_enrollments" ("id");
CREATE UNIQUE INDEX "levelup_enrollments_user_id_level_id_key" ON "levelup_enrollments" ("user_id","level_id");
CREATE UNIQUE INDEX "uq_levelup_enrollments_user_level" ON "levelup_enrollments" ("user_id","level_id");
CREATE UNIQUE INDEX "levelup_milestone_validations_pkey" ON "levelup_milestone_validations" ("id");
CREATE UNIQUE INDEX "levelup_milestones_pkey" ON "levelup_milestones" ("id");
CREATE UNIQUE INDEX "levelup_rate_limit_counters_pkey" ON "levelup_rate_limit_counters" ("user_id","command_name","window_started_at","window_seconds");
CREATE INDEX "idx_lighthouse_admin_audit_trail_created_at" ON "lighthouse_admin_audit_trail" ("created_at");
CREATE UNIQUE INDEX "lighthouse_admin_audit_trail_pkey" ON "lighthouse_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "lighthouse_announcements_pkey" ON "lighthouse_announcements" ("id");
CREATE UNIQUE INDEX "lighthouse_blocks_blocker_user_id_blocked_user_id_key" ON "lighthouse_blocks" ("blocker_user_id","blocked_user_id");
CREATE UNIQUE INDEX "lighthouse_blocks_pkey" ON "lighthouse_blocks" ("id");
CREATE INDEX "idx_lighthouse_matches_host_user_id" ON "lighthouse_matches" ("host_user_id");
CREATE INDEX "idx_lighthouse_matches_property_id" ON "lighthouse_matches" ("property_id");
CREATE INDEX "idx_lighthouse_matches_seeker_user_id" ON "lighthouse_matches" ("seeker_user_id");
CREATE INDEX "idx_lighthouse_matches_status" ON "lighthouse_matches" ("status");
CREATE INDEX "idx_lighthouse_matches_updated_at" ON "lighthouse_matches" ("updated_at");
CREATE UNIQUE INDEX "lighthouse_matches_pkey" ON "lighthouse_matches" ("id");
CREATE INDEX "idx_lighthouse_profiles_profile_type" ON "lighthouse_profiles" ("profile_type");
CREATE INDEX "idx_lighthouse_profiles_updated_at" ON "lighthouse_profiles" ("updated_at");
CREATE UNIQUE INDEX "lighthouse_profiles_pkey" ON "lighthouse_profiles" ("id");
CREATE UNIQUE INDEX "lighthouse_profiles_user_id_unique" ON "lighthouse_profiles" ("user_id");
CREATE INDEX "idx_lighthouse_properties_host_user_id" ON "lighthouse_properties" ("host_user_id");
CREATE INDEX "idx_lighthouse_properties_updated_at" ON "lighthouse_properties" ("updated_at");
CREATE UNIQUE INDEX "lighthouse_properties_pkey" ON "lighthouse_properties" ("id");
CREATE UNIQUE INDEX "lighthouse_user_extension_pkey" ON "lighthouse_user_extension" ("user_id");
CREATE INDEX "idx_login_events_created" ON "login_events" ("created_at");
CREATE INDEX "idx_login_events_user" ON "login_events" ("user_id");
CREATE INDEX "idx_login_events_user_created_at" ON "login_events" ("user_id","created_at");
CREATE UNIQUE INDEX "login_events_pkey" ON "login_events" ("id");
CREATE UNIQUE INDEX "messages_pkey" ON "messages" ("id");
CREATE INDEX "idx_moderation_reports_created_at" ON "moderation_reports" ("created_at");
CREATE INDEX "idx_moderation_reports_status" ON "moderation_reports" ("status");
CREATE UNIQUE INDEX "moderation_reports_pkey" ON "moderation_reports" ("id");
CREATE UNIQUE INDEX "mood_announcements_pkey" ON "mood_announcements" ("id");
CREATE UNIQUE INDEX "mood_checks_pkey" ON "mood_checks" ("id");
CREATE UNIQUE INDEX "mood_submissions_pkey" ON "mood_submissions" ("id");
CREATE INDEX "idx_nps_responses_created_at" ON "nps_responses" ("created_at");
CREATE INDEX "idx_nps_responses_user_id" ON "nps_responses" ("user_id");
CREATE UNIQUE INDEX "nps_responses_pkey" ON "nps_responses" ("id");
CREATE INDEX "idx_otp_codes_code" ON "otp_codes" ("code");
CREATE INDEX "idx_otp_codes_expires_at" ON "otp_codes" ("expires_at");
CREATE INDEX "idx_otp_codes_user_id" ON "otp_codes" ("user_id");
CREATE UNIQUE INDEX "otp_codes_pkey" ON "otp_codes" ("id");
CREATE UNIQUE INDEX "partnerships_pkey" ON "partnerships" ("id");
CREATE UNIQUE INDEX "payments_pkey" ON "payments" ("id");
CREATE UNIQUE INDEX "peer_programming_admin_audit_trail_pkey" ON "peer_programming_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "peer_programming_assignment_notific_user_id_idempotency_key_key" ON "peer_programming_assignment_notifications" ("user_id","idempotency_key");
CREATE UNIQUE INDEX "peer_programming_assignment_notifications_pkey" ON "peer_programming_assignment_notifications" ("id");
CREATE UNIQUE INDEX "peer_programming_cohort_members_cohort_id_user_id_key" ON "peer_programming_cohort_members" ("cohort_id","user_id");
CREATE UNIQUE INDEX "peer_programming_cohort_members_pkey" ON "peer_programming_cohort_members" ("id");
CREATE UNIQUE INDEX "peer_programming_cohorts_pkey" ON "peer_programming_cohorts" ("id");
CREATE UNIQUE INDEX "peer_programming_cohorts_week_start_date_cohort_label_key" ON "peer_programming_cohorts" ("week_start_date","cohort_label");
CREATE UNIQUE INDEX "peer_programming_feedback_pkey" ON "peer_programming_feedback" ("id");
CREATE UNIQUE INDEX "peer_programming_messages_pkey" ON "peer_programming_messages" ("id");
CREATE UNIQUE INDEX "peer_programming_weekly_topics_pkey" ON "peer_programming_weekly_topics" ("id");
CREATE UNIQUE INDEX "pricing_tiers_pkey" ON "pricing_tiers" ("id");
CREATE UNIQUE INDEX "profile_deletion_logs_pkey" ON "profile_deletion_logs" ("id");
CREATE UNIQUE INDEX "reports_pkey" ON "reports" ("id");
CREATE UNIQUE INDEX "service_credits_account_deletion_reclaims_pkey" ON "service_credits_account_deletion_reclaims" ("id");
CREATE UNIQUE INDEX "service_credits_adapter_outbox_pkey" ON "service_credits_adapter_outbox" ("id");
CREATE UNIQUE INDEX "service_credits_admin_audit_trail_pkey" ON "service_credits_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "service_credits_command_idempotency_pkey" ON "service_credits_command_idempotency" ("id");
CREATE UNIQUE INDEX "service_credits_dispute_adjustments_pkey" ON "service_credits_dispute_adjustments" ("id");
CREATE UNIQUE INDEX "service_credits_disputes_pkey" ON "service_credits_disputes" ("id");
CREATE UNIQUE INDEX "service_credits_escrow_holds_pkey" ON "service_credits_escrow_holds" ("id");
CREATE UNIQUE INDEX "service_credits_governance_events_pkey" ON "service_credits_governance_events" ("id");
CREATE UNIQUE INDEX "service_credits_ledger_entries_pkey" ON "service_credits_ledger_entries" ("id");
CREATE UNIQUE INDEX "service_credits_transfers_pkey" ON "service_credits_transfers" ("id");
CREATE UNIQUE INDEX "service_credits_treasury_config_pkey" ON "service_credits_treasury_config" ("id");
CREATE UNIQUE INDEX "service_credits_treasury_events_pkey" ON "service_credits_treasury_events" ("id");
CREATE UNIQUE INDEX "service_credits_wallet_tombstones_pkey" ON "service_credits_wallet_tombstones" ("id");
CREATE UNIQUE INDEX "service_credits_wallets_pkey" ON "service_credits_wallets" ("user_id");
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
CREATE INDEX "idx_session_expire" ON "sessions" ("expire");
CREATE UNIQUE INDEX "sessions_pkey" ON "sessions" ("sid");
CREATE UNIQUE INDEX "skills_hunt_achievements_pkey" ON "skills_hunt_achievements" ("id");
CREATE UNIQUE INDEX "skills_hunt_achievements_user_id_code_key" ON "skills_hunt_achievements" ("user_id","code");
CREATE INDEX "idx_skills_hunt_audit_log_lookup" ON "skills_hunt_audit_log" ("created_at","actor_id","command");
CREATE UNIQUE INDEX "skills_hunt_audit_log_pkey" ON "skills_hunt_audit_log" ("id");
CREATE UNIQUE INDEX "skills_hunt_directory_profiles_directory_profile_id_key" ON "skills_hunt_directory_profiles" ("directory_profile_id");
CREATE UNIQUE INDEX "skills_hunt_directory_profiles_pkey" ON "skills_hunt_directory_profiles" ("id");
CREATE UNIQUE INDEX "skills_hunt_directory_profiles_submission_id_key" ON "skills_hunt_directory_profiles" ("submission_id");
CREATE UNIQUE INDEX "skills_hunt_feature_reward_card_pkey" ON "skills_hunt_feature_reward_card" ("singleton_key");
CREATE INDEX "idx_skills_hunt_leaderboard_lookup" ON "skills_hunt_leaderboard" ("round_id","mode","rank","score");
CREATE UNIQUE INDEX "skills_hunt_leaderboard_pkey" ON "skills_hunt_leaderboard" ("id");
CREATE UNIQUE INDEX "skills_hunt_leaderboard_round_id_mode_rank_key" ON "skills_hunt_leaderboard" ("round_id","mode","rank");
CREATE INDEX "idx_skills_hunt_notifications_user_unread" ON "skills_hunt_notifications" ("user_id","is_read","created_at");
CREATE UNIQUE INDEX "skills_hunt_notifications_pkey" ON "skills_hunt_notifications" ("id");
CREATE UNIQUE INDEX "skills_hunt_rare_skills_lookup_pkey" ON "skills_hunt_rare_skills_lookup" ("id");
CREATE UNIQUE INDEX "skills_hunt_rare_skills_lookup_round_id_skill_name_key" ON "skills_hunt_rare_skills_lookup" ("round_id","skill_name");
CREATE INDEX "idx_skills_hunt_rounds_status_window" ON "skills_hunt_rounds" ("status","starts_at","ends_at");
CREATE UNIQUE INDEX "skills_hunt_rounds_pkey" ON "skills_hunt_rounds" ("id");
CREATE INDEX "idx_skills_hunt_service_credits_from_user" ON "skills_hunt_service_credits_transactions" ("from_user_id");
CREATE INDEX "idx_skills_hunt_service_credits_submission_id" ON "skills_hunt_service_credits_transactions" ("submission_id");
CREATE INDEX "idx_skills_hunt_service_credits_to_user" ON "skills_hunt_service_credits_transactions" ("to_user_id");
CREATE UNIQUE INDEX "skills_hunt_service_credits_transactions_pkey" ON "skills_hunt_service_credits_transactions" ("id");
CREATE INDEX "idx_skills_hunt_submissions_round_status_created" ON "skills_hunt_submissions" ("round_id","status","created_at");
CREATE INDEX "idx_skills_hunt_submissions_submitter_created" ON "skills_hunt_submissions" ("submitter_user_id","created_at");
CREATE UNIQUE INDEX "skills_hunt_submissions_pkey" ON "skills_hunt_submissions" ("id");
CREATE UNIQUE INDEX "skills_hunt_submissions_round_id_signature_hash_key" ON "skills_hunt_submissions" ("round_id","signature_hash");
CREATE UNIQUE INDEX "skills_job_titles_pkey" ON "skills_job_titles" ("id");
CREATE UNIQUE INDEX "skills_sectors_name_key" ON "skills_sectors" ("name");
CREATE UNIQUE INDEX "skills_sectors_pkey" ON "skills_sectors" ("id");
CREATE UNIQUE INDEX "skills_skills_pkey" ON "skills_skills" ("id");
CREATE INDEX "idx_skills_taxonomy_change_events_target" ON "skills_taxonomy_change_events" ("target_type","target_id","created_at");
CREATE UNIQUE INDEX "skills_taxonomy_change_events_pkey" ON "skills_taxonomy_change_events" ("id");
CREATE INDEX "idx_skills_taxonomy_consumer_bindings_target" ON "skills_taxonomy_consumer_bindings" ("target_type","target_id");
CREATE UNIQUE INDEX "skills_taxonomy_consumer_bind_consumer_name_target_type_tar_key" ON "skills_taxonomy_consumer_bindings" ("consumer_name","target_type","target_id");
CREATE UNIQUE INDEX "skills_taxonomy_consumer_bindings_pkey" ON "skills_taxonomy_consumer_bindings" ("id");
CREATE UNIQUE INDEX "skills_taxonomy_deletion_events_pkey" ON "skills_taxonomy_deletion_events" ("id");
CREATE UNIQUE INDEX "skills_taxonomy_flattened_projection_pkey" ON "skills_taxonomy_flattened_projection" ("id");
CREATE INDEX "idx_skills_taxonomy_job_titles_sector" ON "skills_taxonomy_job_titles" ("sector_id");
CREATE UNIQUE INDEX "skills_taxonomy_job_titles_pkey" ON "skills_taxonomy_job_titles" ("id");
CREATE UNIQUE INDEX "uq_skills_taxonomy_job_titles_sector_name_ci" ON "skills_taxonomy_job_titles" ("sector_id","lower(name)");
CREATE UNIQUE INDEX "skills_taxonomy_sectors_pkey" ON "skills_taxonomy_sectors" ("id");
CREATE UNIQUE INDEX "uq_skills_taxonomy_sectors_name_ci" ON "skills_taxonomy_sectors" ("lower(name)");
CREATE UNIQUE INDEX "skills_taxonomy_skill_votes_pkey" ON "skills_taxonomy_skill_votes" ("id");
CREATE UNIQUE INDEX "skills_taxonomy_skill_votes_user_id_skill_id_key" ON "skills_taxonomy_skill_votes" ("user_id","skill_id");
CREATE INDEX "idx_skills_taxonomy_skills_job_title" ON "skills_taxonomy_skills" ("job_title_id");
CREATE UNIQUE INDEX "skills_taxonomy_skills_pkey" ON "skills_taxonomy_skills" ("id");
CREATE UNIQUE INDEX "uq_skills_taxonomy_skills_job_title_name_ci" ON "skills_taxonomy_skills" ("job_title_id","lower(name)");
CREATE UNIQUE INDEX "skills_taxonomy_user_extension_pkey" ON "skills_taxonomy_user_extension" ("user_id");
CREATE UNIQUE INDEX "skills_taxonomy_user_skills_pkey" ON "skills_taxonomy_user_skills" ("id");
CREATE UNIQUE INDEX "skills_taxonomy_user_skills_user_id_skill_id_key" ON "skills_taxonomy_user_skills" ("user_id","skill_id");
CREATE UNIQUE INDEX "socketrelay_admin_audit_trail_pkey" ON "socketrelay_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "socketrelay_announcements_pkey" ON "socketrelay_announcements" ("id");
CREATE UNIQUE INDEX "socketrelay_fulfillment_participants_pkey" ON "socketrelay_fulfillment_participants" ("fulfillment_id","user_id");
CREATE UNIQUE INDEX "socketrelay_fulfillments_pkey" ON "socketrelay_fulfillments" ("id");
CREATE UNIQUE INDEX "socketrelay_messages_pkey" ON "socketrelay_messages" ("id");
CREATE UNIQUE INDEX "socketrelay_profiles_pkey" ON "socketrelay_profiles" ("id");
CREATE UNIQUE INDEX "socketrelay_profiles_user_id_unique" ON "socketrelay_profiles" ("user_id");
CREATE UNIQUE INDEX "socketrelay_request_events_pkey" ON "socketrelay_request_events" ("id");
CREATE UNIQUE INDEX "socketrelay_requests_pkey" ON "socketrelay_requests" ("id");
CREATE UNIQUE INDEX "socketrelay_user_extension_pkey" ON "socketrelay_user_extension" ("user_id");
CREATE UNIQUE INDEX "support_match_profiles_pkey" ON "support_match_profiles" ("id");
CREATE UNIQUE INDEX "support_match_profiles_user_id_unique" ON "support_match_profiles" ("user_id");
CREATE UNIQUE INDEX "supportmatch_announcements_pkey" ON "supportmatch_announcements" ("id");
CREATE UNIQUE INDEX "trust_admin_audit_trail_pkey" ON "trust_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "trust_user_extension_pkey" ON "trust_user_extension" ("user_id");
CREATE UNIQUE INDEX "trusttransport_admin_audit_trail_pkey" ON "trusttransport_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "trusttransport_announcements_pkey" ON "trusttransport_announcements" ("id");
CREATE UNIQUE INDEX "trusttransport_disputes_pkey" ON "trusttransport_disputes" ("id");
CREATE UNIQUE INDEX "trusttransport_earnings_ledger_pkey" ON "trusttransport_earnings_ledger" ("id");
CREATE UNIQUE INDEX "trusttransport_market_config_pkey" ON "trusttransport_market_config" ("id");
CREATE UNIQUE INDEX "trusttransport_offers_pkey" ON "trusttransport_offers" ("id");
CREATE UNIQUE INDEX "trusttransport_payout_requests_pkey" ON "trusttransport_payout_requests" ("id");
CREATE UNIQUE INDEX "trusttransport_profiles_pkey" ON "trusttransport_profiles" ("id");
CREATE UNIQUE INDEX "trusttransport_profiles_user_id_unique" ON "trusttransport_profiles" ("user_id");
CREATE UNIQUE INDEX "trusttransport_proof_artifacts_pkey" ON "trusttransport_proof_artifacts" ("id");
CREATE UNIQUE INDEX "trusttransport_ratings_pkey" ON "trusttransport_ratings" ("id");
CREATE UNIQUE INDEX "trusttransport_requests_pkey" ON "trusttransport_requests" ("id");
CREATE UNIQUE INDEX "trusttransport_ride_requests_pkey" ON "trusttransport_ride_requests" ("id");
CREATE UNIQUE INDEX "trusttransport_risk_signals_pkey" ON "trusttransport_risk_signals" ("id");
CREATE UNIQUE INDEX "trusttransport_status_events_pkey" ON "trusttransport_status_events" ("id");
CREATE UNIQUE INDEX "trusttransport_trips_pkey" ON "trusttransport_trips" ("id");
CREATE UNIQUE INDEX "trusttransport_user_extension_pkey" ON "trusttransport_user_extension" ("user_id");
CREATE UNIQUE INDEX "unlock_audit_log_pkey" ON "unlock_audit_log" ("id");
CREATE UNIQUE INDEX "unlock_runtime_config_pkey" ON "unlock_runtime_config" ("singleton_id");
CREATE UNIQUE INDEX "unlock_verification_submissions_pkey" ON "unlock_verification_submissions" ("user_id");
CREATE UNIQUE INDEX "idx_users_username_ci_unique" ON "users" ("lower((username)::text)");
CREATE INDEX "idx_users_username_lookup" ON "users" ("username");
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");
CREATE UNIQUE INDEX "users_pkey" ON "users" ("id");
CREATE INDEX "idx_waitlist_signups_email" ON "waitlist_signups" ("email");
CREATE UNIQUE INDEX "waitlist_signups_pkey" ON "waitlist_signups" ("id");
CREATE UNIQUE INDEX "weekly_performance_audit_trail_pkey" ON "weekly_performance_audit_trail" ("id");
CREATE UNIQUE INDEX "weekly_performance_metrics_pkey" ON "weekly_performance_metrics" ("id");
CREATE UNIQUE INDEX "weekly_performance_weeks_pkey" ON "weekly_performance_weeks" ("id");
CREATE UNIQUE INDEX "workforce_admin_audit_trail_pkey" ON "workforce_admin_audit_trail" ("id");
CREATE UNIQUE INDEX "workforce_announcements_pkey" ON "workforce_announcements" ("id");
CREATE UNIQUE INDEX "workforce_config_pkey" ON "workforce_config" ("singleton_key");
CREATE UNIQUE INDEX "workforce_export_jobs_pkey" ON "workforce_export_jobs" ("id");
CREATE UNIQUE INDEX "workforce_occupations_pkey" ON "workforce_occupations" ("id");
CREATE UNIQUE INDEX "workforce_profiles_pkey" ON "workforce_profiles" ("user_id");
CREATE UNIQUE INDEX "workforce_recruited_events_pkey" ON "workforce_recruited_events" ("id");
CREATE UNIQUE INDEX "workforce_recruited_sync_cursor_pkey" ON "workforce_recruited_sync_cursor" ("singleton_key");
CREATE UNIQUE INDEX "workforce_recruiter_announcements_pkey" ON "workforce_recruiter_announcements" ("id");
CREATE UNIQUE INDEX "workforce_recruiter_config_pkey" ON "workforce_recruiter_config" ("id");
CREATE UNIQUE INDEX "workforce_recruiter_meetup_event_signups_pkey" ON "workforce_recruiter_meetup_event_signups" ("id");
CREATE UNIQUE INDEX "workforce_recruiter_meetup_events_pkey" ON "workforce_recruiter_meetup_events" ("id");
CREATE INDEX "idx_workforce_recruiter_occupations_sector" ON "workforce_recruiter_occupations" ("sector");
CREATE INDEX "idx_workforce_recruiter_occupations_skill_level" ON "workforce_recruiter_occupations" ("skill_level");
CREATE UNIQUE INDEX "workforce_recruiter_occupations_pkey" ON "workforce_recruiter_occupations" ("id");
CREATE INDEX "idx_workforce_recruiter_profiles_user_id" ON "workforce_recruiter_profiles" ("user_id");
CREATE UNIQUE INDEX "workforce_recruiter_profiles_pkey" ON "workforce_recruiter_profiles" ("id");
CREATE UNIQUE INDEX "workforce_recruiter_profiles_user_id_key" ON "workforce_recruiter_profiles" ("user_id");
CREATE UNIQUE INDEX "workforce_recruiter_recruitment_events_pkey" ON "workforce_recruiter_recruitment_events" ("id");
CREATE UNIQUE INDEX "workforce_user_extension_pkey" ON "workforce_user_extension" ("user_id");
CREATE UNIQUE INDEX "idx_replit_database_migrations_v1_build_id" ON "_system"."replit_database_migrations_v1" ("build_id");
CREATE UNIQUE INDEX "replit_database_migrations_v1_pkey" ON "_system"."replit_database_migrations_v1" ("id");
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "users"("id");
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "chyme_messages" ADD CONSTRAINT "chyme_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chyme_rooms"("id") ON DELETE CASCADE;
ALTER TABLE "chyme_room_members" ADD CONSTRAINT "chyme_room_members_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chyme_rooms"("id") ON DELETE CASCADE;
ALTER TABLE "default_alive_or_dead_financial_entries" ADD CONSTRAINT "default_alive_or_dead_financial_entries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");
ALTER TABLE "directory_profiles" ADD CONSTRAINT "directory_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "exclusions" ADD CONSTRAINT "exclusions_excluded_user_id_support_match_profiles_user_id_fk" FOREIGN KEY ("excluded_user_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "exclusions" ADD CONSTRAINT "exclusions_user_id_support_match_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "feed_item_targets" ADD CONSTRAINT "feed_item_targets_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "feed_items"("id") ON DELETE CASCADE;
ALTER TABLE "feed_user_dismissals" ADD CONSTRAINT "feed_user_dismissals_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "feed_items"("id") ON DELETE CASCADE;
ALTER TABLE "feed_user_read_state" ADD CONSTRAINT "feed_user_read_state_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "feed_items"("id") ON DELETE CASCADE;
ALTER TABLE "foundation_quote_requests" ADD CONSTRAINT "foundation_quote_requests_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "foundation_connection_threads"("id");
ALTER TABLE "gentlepulse_favorites" ADD CONSTRAINT "gentlepulse_favorites_meditation_id_gentlepulse_meditations_id_" FOREIGN KEY ("meditation_id") REFERENCES "gentlepulse_meditations"("id");
ALTER TABLE "gentlepulse_ratings" ADD CONSTRAINT "gentlepulse_ratings_meditation_id_gentlepulse_meditations_id_fk" FOREIGN KEY ("meditation_id") REFERENCES "gentlepulse_meditations"("id");
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id");
ALTER TABLE "lighthouse_matches" ADD CONSTRAINT "lighthouse_matches_property_id_lighthouse_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "lighthouse_properties"("id");
ALTER TABLE "lighthouse_matches" ADD CONSTRAINT "lighthouse_matches_seeker_id_lighthouse_profiles_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "lighthouse_profiles"("id");
ALTER TABLE "lighthouse_profiles" ADD CONSTRAINT "lighthouse_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "lighthouse_properties" ADD CONSTRAINT "lighthouse_properties_host_id_lighthouse_profiles_id_fk" FOREIGN KEY ("host_id") REFERENCES "lighthouse_profiles"("id");
ALTER TABLE "login_events" ADD CONSTRAINT "login_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_partnership_id_partnerships_id_fk" FOREIGN KEY ("partnership_id") REFERENCES "partnerships"("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_support_match_profiles_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "nps_responses" ADD CONSTRAINT "nps_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_user1_id_support_match_profiles_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_user2_id_support_match_profiles_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "users"("id");
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_partnership_id_partnerships_id_fk" FOREIGN KEY ("partnership_id") REFERENCES "partnerships"("id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_support_match_profiles_user_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_support_match_profiles_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "support_match_profiles"("user_id");
ALTER TABLE "skills_hunt_directory_profiles" ADD CONSTRAINT "skills_hunt_directory_profiles_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "skills_hunt_submissions"("id") ON DELETE CASCADE;
ALTER TABLE "skills_hunt_leaderboard" ADD CONSTRAINT "skills_hunt_leaderboard_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "skills_hunt_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "skills_hunt_rare_skills_lookup" ADD CONSTRAINT "skills_hunt_rare_skills_lookup_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "skills_hunt_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "skills_hunt_service_credits_transactions" ADD CONSTRAINT "skills_hunt_service_credits_transactions_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id");
ALTER TABLE "skills_hunt_service_credits_transactions" ADD CONSTRAINT "skills_hunt_service_credits_transactions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "skills_hunt_submissions"("id");
ALTER TABLE "skills_hunt_service_credits_transactions" ADD CONSTRAINT "skills_hunt_service_credits_transactions_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id");
ALTER TABLE "skills_hunt_submissions" ADD CONSTRAINT "skills_hunt_submissions_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "skills_hunt_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "skills_job_titles" ADD CONSTRAINT "skills_job_titles_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "skills_sectors"("id") ON DELETE CASCADE;
ALTER TABLE "skills_skills" ADD CONSTRAINT "skills_skills_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "skills_job_titles"("id") ON DELETE CASCADE;
ALTER TABLE "skills_taxonomy_job_titles" ADD CONSTRAINT "skills_taxonomy_job_titles_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "skills_taxonomy_sectors"("id") ON DELETE RESTRICT;
ALTER TABLE "skills_taxonomy_skill_votes" ADD CONSTRAINT "skills_taxonomy_skill_votes_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills_taxonomy_skills"("id") ON DELETE RESTRICT;
ALTER TABLE "skills_taxonomy_skills" ADD CONSTRAINT "skills_taxonomy_skills_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "skills_taxonomy_job_titles"("id") ON DELETE RESTRICT;
ALTER TABLE "skills_taxonomy_user_skills" ADD CONSTRAINT "skills_taxonomy_user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills_taxonomy_skills"("id") ON DELETE RESTRICT;
ALTER TABLE "socketrelay_fulfillments" ADD CONSTRAINT "socketrelay_fulfillments_closed_by_users_id_fk" FOREIGN KEY ("closed_by") REFERENCES "users"("id");
ALTER TABLE "socketrelay_fulfillments" ADD CONSTRAINT "socketrelay_fulfillments_fulfiller_user_id_users_id_fk" FOREIGN KEY ("fulfiller_user_id") REFERENCES "users"("id");
ALTER TABLE "socketrelay_fulfillments" ADD CONSTRAINT "socketrelay_fulfillments_request_id_socketrelay_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "socketrelay_requests"("id");
ALTER TABLE "socketrelay_messages" ADD CONSTRAINT "socketrelay_messages_fulfillment_id_socketrelay_fulfillments_id" FOREIGN KEY ("fulfillment_id") REFERENCES "socketrelay_fulfillments"("id");
ALTER TABLE "socketrelay_messages" ADD CONSTRAINT "socketrelay_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id");
ALTER TABLE "socketrelay_profiles" ADD CONSTRAINT "socketrelay_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "socketrelay_requests" ADD CONSTRAINT "socketrelay_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "support_match_profiles" ADD CONSTRAINT "support_match_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "trusttransport_offers" ADD CONSTRAINT "trusttransport_offers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "trusttransport_requests"("id") ON DELETE CASCADE;
ALTER TABLE "trusttransport_profiles" ADD CONSTRAINT "trusttransport_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "trusttransport_proof_artifacts" ADD CONSTRAINT "trusttransport_proof_artifacts_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trusttransport_trips"("id") ON DELETE CASCADE;
ALTER TABLE "trusttransport_ratings" ADD CONSTRAINT "trusttransport_ratings_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trusttransport_trips"("id") ON DELETE CASCADE;
ALTER TABLE "trusttransport_ride_requests" ADD CONSTRAINT "trusttransport_ride_requests_driver_id_trusttransport_profiles_" FOREIGN KEY ("driver_id") REFERENCES "trusttransport_profiles"("id");
ALTER TABLE "trusttransport_ride_requests" ADD CONSTRAINT "trusttransport_ride_requests_rider_id_users_id_fk" FOREIGN KEY ("rider_id") REFERENCES "users"("id");
ALTER TABLE "trusttransport_status_events" ADD CONSTRAINT "trusttransport_status_events_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "trusttransport_requests"("id") ON DELETE CASCADE;
ALTER TABLE "trusttransport_trips" ADD CONSTRAINT "trusttransport_trips_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "trusttransport_requests"("id") ON DELETE CASCADE;
ALTER TABLE "workforce_recruiter_meetup_event_signups" ADD CONSTRAINT "workforce_recruiter_meetup_event_signups_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "workforce_recruiter_meetup_events"("id") ON DELETE CASCADE;
ALTER TABLE "workforce_recruiter_meetup_event_signups" ADD CONSTRAINT "workforce_recruiter_meetup_event_signups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "workforce_recruiter_meetup_events" ADD CONSTRAINT "workforce_recruiter_meetup_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");
ALTER TABLE "workforce_recruiter_meetup_events" ADD CONSTRAINT "workforce_recruiter_meetup_events_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "workforce_recruiter_occupations"("id") ON DELETE CASCADE;
ALTER TABLE "workforce_recruiter_occupations" ADD CONSTRAINT "workforce_recruiter_occupations_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "skills_job_titles"("id") ON DELETE RESTRICT;
ALTER TABLE "workforce_recruiter_occupations" ADD CONSTRAINT "workforce_recruiter_occupations_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "skills_sectors"("id") ON DELETE RESTRICT;
ALTER TABLE "workforce_recruiter_profiles" ADD CONSTRAINT "workforce_recruiter_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "workforce_recruiter_recruitment_events" ADD CONSTRAINT "workforce_recruiter_recruitment_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");
ALTER TABLE "workforce_recruiter_recruitment_events" ADD CONSTRAINT "workforce_recruiter_recruitment_events_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "workforce_recruiter_occupations"("id") ON DELETE CASCADE;
CREATE VIEW "skills_taxonomy_dependency_graph" TABLESPACE public AS (SELECT target_type, target_id, sum(reference_count)::integer AS total_references, max(updated_at) AS snapshot_at FROM skills_taxonomy_consumer_bindings GROUP BY target_type, target_id);
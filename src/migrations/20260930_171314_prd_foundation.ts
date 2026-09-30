import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_kind" AS ENUM('annual', 'research', 'programme');
  CREATE TYPE "public"."enum_reports_document_language" AS ENUM('th', 'en', 'multilingual');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_kind" AS ENUM('annual', 'research', 'programme');
  CREATE TYPE "public"."enum__reports_v_version_document_language" AS ENUM('th', 'en', 'multilingual');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_published_locale" AS ENUM('en', 'th');
  CREATE TYPE "public"."enum_impact_metrics_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__impact_metrics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__impact_metrics_v_published_locale" AS ENUM('en', 'th');
  CREATE TYPE "public"."enum_stories_anonymity" AS ENUM('anonymous', 'pseudonym', 'identified');
  CREATE TYPE "public"."enum_stories_consent_status" AS ENUM('pending', 'approved', 'withdrawn');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_anonymity" AS ENUM('anonymous', 'pseudonym', 'identified');
  CREATE TYPE "public"."enum__stories_v_version_consent_status" AS ENUM('pending', 'approved', 'withdrawn');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_published_locale" AS ENUM('en', 'th');
  CREATE TABLE "reports" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "kind" "enum_reports_kind",
    "year" numeric,
    "published_at" timestamp(3) with time zone,
    "source_u_r_l" varchar,
    "download_u_r_l" varchar,
    "document_language" "enum_reports_document_language",
    "cover_image_id" integer,
    "reviewed_at" timestamp(3) with time zone,
    "reviewed_by" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_reports_status" DEFAULT 'draft'
  );

  CREATE TABLE "reports_locales" (
    "title" varchar,
    "summary" varchar,
    "method" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_reports_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_kind" "enum__reports_v_version_kind",
    "version_year" numeric,
    "version_published_at" timestamp(3) with time zone,
    "version_source_u_r_l" varchar,
    "version_download_u_r_l" varchar,
    "version_document_language" "enum__reports_v_version_document_language",
    "version_cover_image_id" integer,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_reviewed_by" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__reports_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__reports_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_reports_v_locales" (
    "version_title" varchar,
    "version_summary" varchar,
    "version_method" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "impact_metrics" (
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "period_start" timestamp(3) with time zone,
    "period_end" timestamp(3) with time zone,
    "source_report_id" integer,
    "source_u_r_l" varchar,
    "featured" boolean DEFAULT false,
    "order" numeric DEFAULT 100,
    "reviewed_at" timestamp(3) with time zone,
    "reviewed_by" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_impact_metrics_status" DEFAULT 'draft'
  );

  CREATE TABLE "impact_metrics_locales" (
    "label" varchar,
    "unit" varchar,
    "period_label" varchar,
    "definition" varchar,
    "method" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_impact_metrics_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_value" varchar,
    "version_period_start" timestamp(3) with time zone,
    "version_period_end" timestamp(3) with time zone,
    "version_source_report_id" integer,
    "version_source_u_r_l" varchar,
    "version_featured" boolean DEFAULT false,
    "version_order" numeric DEFAULT 100,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_reviewed_by" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__impact_metrics_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__impact_metrics_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_impact_metrics_v_locales" (
    "version_label" varchar,
    "version_unit" varchar,
    "version_period_label" varchar,
    "version_definition" varchar,
    "version_method" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "stories" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "story_date" timestamp(3) with time zone,
    "cover_image_id" integer,
    "anonymity" "enum_stories_anonymity" DEFAULT 'anonymous',
    "consent_status" "enum_stories_consent_status" DEFAULT 'pending',
    "consent_scope" varchar,
    "safety_reviewed_at" timestamp(3) with time zone,
    "approved_by" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_stories_status" DEFAULT 'draft'
  );

  CREATE TABLE "stories_locales" (
    "title" varchar,
    "summary" varchar,
    "content" jsonb,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "_stories_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_story_date" timestamp(3) with time zone,
    "version_cover_image_id" integer,
    "version_anonymity" "enum__stories_v_version_anonymity" DEFAULT 'anonymous',
    "version_consent_status" "enum__stories_v_version_consent_status" DEFAULT 'pending',
    "version_consent_scope" varchar,
    "version_safety_reviewed_at" timestamp(3) with time zone,
    "version_approved_by" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__stories_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "snapshot" boolean,
    "published_locale" "enum__stories_v_published_locale",
    "latest" boolean
  );

  CREATE TABLE "_stories_v_locales" (
    "version_title" varchar,
    "version_summary" varchar,
    "version_content" jsonb,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE "footer_hotlines_locales" (
    "availability" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "impact_metrics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stories_id" integer;
  ALTER TABLE "footer_hotlines" ADD COLUMN "verified_at" timestamp(3) with time zone;
  ALTER TABLE "footer_hotlines" ADD COLUMN "verified_by" varchar;
  ALTER TABLE "footer" ADD COLUMN "bank_verified_at" timestamp(3) with time zone;
  ALTER TABLE "footer" ADD COLUMN "bank_verified_by" varchar;
  ALTER TABLE "footer" ADD COLUMN "bank_account_name" varchar;
  ALTER TABLE "footer" ADD COLUMN "bank_account_number" varchar;
  ALTER TABLE "footer" ADD COLUMN "bank_swift" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "bank_name" varchar;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_locales" ADD CONSTRAINT "_reports_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "impact_metrics" ADD CONSTRAINT "impact_metrics_source_report_id_reports_id_fk" FOREIGN KEY ("source_report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "impact_metrics_locales" ADD CONSTRAINT "impact_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impact_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_impact_metrics_v" ADD CONSTRAINT "_impact_metrics_v_parent_id_impact_metrics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."impact_metrics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impact_metrics_v" ADD CONSTRAINT "_impact_metrics_v_version_source_report_id_reports_id_fk" FOREIGN KEY ("version_source_report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_impact_metrics_v_locales" ADD CONSTRAINT "_impact_metrics_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_impact_metrics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_locales" ADD CONSTRAINT "_stories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_hotlines_locales" ADD CONSTRAINT "footer_hotlines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_hotlines"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX "reports_cover_image_idx" ON "reports" USING btree ("cover_image_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE UNIQUE INDEX "reports_locales_locale_parent_id_unique" ON "reports_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_cover_image_idx" ON "_reports_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_snapshot_idx" ON "_reports_v" USING btree ("snapshot");
  CREATE INDEX "_reports_v_published_locale_idx" ON "_reports_v" USING btree ("published_locale");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_reports_v_locales_locale_parent_id_unique" ON "_reports_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "impact_metrics_source_report_idx" ON "impact_metrics" USING btree ("source_report_id");
  CREATE INDEX "impact_metrics_updated_at_idx" ON "impact_metrics" USING btree ("updated_at");
  CREATE INDEX "impact_metrics_created_at_idx" ON "impact_metrics" USING btree ("created_at");
  CREATE INDEX "impact_metrics__status_idx" ON "impact_metrics" USING btree ("_status");
  CREATE UNIQUE INDEX "impact_metrics_locales_locale_parent_id_unique" ON "impact_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_impact_metrics_v_parent_idx" ON "_impact_metrics_v" USING btree ("parent_id");
  CREATE INDEX "_impact_metrics_v_version_version_source_report_idx" ON "_impact_metrics_v" USING btree ("version_source_report_id");
  CREATE INDEX "_impact_metrics_v_version_version_updated_at_idx" ON "_impact_metrics_v" USING btree ("version_updated_at");
  CREATE INDEX "_impact_metrics_v_version_version_created_at_idx" ON "_impact_metrics_v" USING btree ("version_created_at");
  CREATE INDEX "_impact_metrics_v_version_version__status_idx" ON "_impact_metrics_v" USING btree ("version__status");
  CREATE INDEX "_impact_metrics_v_created_at_idx" ON "_impact_metrics_v" USING btree ("created_at");
  CREATE INDEX "_impact_metrics_v_updated_at_idx" ON "_impact_metrics_v" USING btree ("updated_at");
  CREATE INDEX "_impact_metrics_v_snapshot_idx" ON "_impact_metrics_v" USING btree ("snapshot");
  CREATE INDEX "_impact_metrics_v_published_locale_idx" ON "_impact_metrics_v" USING btree ("published_locale");
  CREATE INDEX "_impact_metrics_v_latest_idx" ON "_impact_metrics_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_impact_metrics_v_locales_locale_parent_id_unique" ON "_impact_metrics_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_cover_image_idx" ON "stories" USING btree ("cover_image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE UNIQUE INDEX "stories_locales_locale_parent_id_unique" ON "stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_cover_image_idx" ON "_stories_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_snapshot_idx" ON "_stories_v" USING btree ("snapshot");
  CREATE INDEX "_stories_v_published_locale_idx" ON "_stories_v" USING btree ("published_locale");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_stories_v_locales_locale_parent_id_unique" ON "_stories_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_hotlines_locales_locale_parent_id_unique" ON "footer_hotlines_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_impact_metrics_fk" FOREIGN KEY ("impact_metrics_id") REFERENCES "public"."impact_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_impact_metrics_id_idx" ON "payload_locked_documents_rels" USING btree ("impact_metrics_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_impact_metrics_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stories_fk";
  ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "impact_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "impact_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_impact_metrics_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_impact_metrics_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_stories_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_hotlines_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_locales" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_locales" CASCADE;
  DROP TABLE "impact_metrics" CASCADE;
  DROP TABLE "impact_metrics_locales" CASCADE;
  DROP TABLE "_impact_metrics_v" CASCADE;
  DROP TABLE "_impact_metrics_v_locales" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_locales" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "_stories_v_locales" CASCADE;
  DROP TABLE "footer_hotlines_locales" CASCADE;
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_impact_metrics_id_idx";
  DROP INDEX "payload_locked_documents_rels_stories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "impact_metrics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stories_id";
  ALTER TABLE "footer_hotlines" DROP COLUMN "verified_at";
  ALTER TABLE "footer_hotlines" DROP COLUMN "verified_by";
  ALTER TABLE "footer" DROP COLUMN "bank_verified_at";
  ALTER TABLE "footer" DROP COLUMN "bank_verified_by";
  ALTER TABLE "footer" DROP COLUMN "bank_account_name";
  ALTER TABLE "footer" DROP COLUMN "bank_account_number";
  ALTER TABLE "footer" DROP COLUMN "bank_swift";
  ALTER TABLE "footer_locales" DROP COLUMN "bank_name";
  DROP TYPE "public"."enum_reports_kind";
  DROP TYPE "public"."enum_reports_document_language";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_kind";
  DROP TYPE "public"."enum__reports_v_version_document_language";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum__reports_v_published_locale";
  DROP TYPE "public"."enum_impact_metrics_status";
  DROP TYPE "public"."enum__impact_metrics_v_version_status";
  DROP TYPE "public"."enum__impact_metrics_v_published_locale";
  DROP TYPE "public"."enum_stories_anonymity";
  DROP TYPE "public"."enum_stories_consent_status";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_anonymity";
  DROP TYPE "public"."enum__stories_v_version_consent_status";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum__stories_v_published_locale";`)
}

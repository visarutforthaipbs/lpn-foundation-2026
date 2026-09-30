import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_topic" AS ENUM('cross-cutting', 'rights', 'health', 'education', 'safety', 'policy');
  CREATE TYPE "public"."enum__reports_v_version_topic" AS ENUM('cross-cutting', 'rights', 'health', 'education', 'safety', 'policy');
  ALTER TABLE "reports" ADD COLUMN "topic" "enum_reports_topic";
  ALTER TABLE "_reports_v" ADD COLUMN "version_topic" "enum__reports_v_version_topic";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DROP COLUMN "topic";
  ALTER TABLE "_reports_v" DROP COLUMN "version_topic";
  DROP TYPE "public"."enum_reports_topic";
  DROP TYPE "public"."enum__reports_v_version_topic";`)
}

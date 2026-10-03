import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "global_giving_project_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "global_giving_verified_at" timestamp(3) with time zone;
  ALTER TABLE "footer" ADD COLUMN "global_giving_verified_by" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP COLUMN "global_giving_project_url";
  ALTER TABLE "footer" DROP COLUMN "global_giving_verified_at";
  ALTER TABLE "footer" DROP COLUMN "global_giving_verified_by";`)
}

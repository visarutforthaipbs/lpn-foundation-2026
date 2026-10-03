import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" ADD COLUMN "image_use_approved" boolean DEFAULT false;
  ALTER TABLE "_stories_v" ADD COLUMN "version_image_use_approved" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" DROP COLUMN "image_use_approved";
  ALTER TABLE "_stories_v" DROP COLUMN "version_image_use_approved";`)
}

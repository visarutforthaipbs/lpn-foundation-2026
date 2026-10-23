import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// teamMembers.name becomes localized (Thai names on /th, English on /en). Existing names are copied into BOTH
// locales so nothing disappears; the editor then overwrites the Thai one. Reverse path: `down` copies the EN
// (fallback TH) value back into a plain column.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members_locales" ADD COLUMN "name" varchar;
    INSERT INTO "team_members_locales" ("_parent_id", "_locale", "name")
      SELECT t.id, l.loc::"_locales", t.name FROM "team_members" t CROSS JOIN (VALUES ('en'), ('th')) AS l(loc)
      ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
    UPDATE "team_members_locales" tl SET "name" = t.name FROM "team_members" t WHERE tl."_parent_id" = t.id AND tl."name" IS NULL;
    ALTER TABLE "team_members" DROP COLUMN "name";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members" ADD COLUMN "name" varchar;
    UPDATE "team_members" t SET "name" = COALESCE(
      (SELECT "name" FROM "team_members_locales" WHERE "_parent_id" = t.id AND "_locale" = 'en'),
      (SELECT "name" FROM "team_members_locales" WHERE "_parent_id" = t.id AND "_locale" = 'th'));
    ALTER TABLE "team_members_locales" DROP COLUMN "name";`)
}

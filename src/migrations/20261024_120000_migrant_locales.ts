import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the migrant-language locales my (Burmese), km (Khmer), lo (Lao) to Payload localization.
// Payload stores the locale list in the `_locales` enum plus one `*_published_locale` enum per
// versioned collection. Only enum VALUES are added — no rows are written; untranslated fields
// fall back to English (payload.config.ts `fallback: true`).
//
// DOWN: recreates each enum without my/km/lo. Run it ONLY when no row uses those locales
// (check: SELECT count(*) FROM <table>_locales WHERE _locale IN ('my','km','lo')) — the cast
// back to the old enum fails loudly otherwise, which is the intended guard.
const ENUMS = [
  '_locales',
  'enum__impact_metrics_v_published_locale',
  'enum__pages_v_published_locale',
  'enum__posts_v_published_locale',
  'enum__reports_v_published_locale',
  'enum__stories_v_published_locale',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const name of ENUMS) {
    for (const value of ['my', 'km', 'lo']) {
      await db.execute(sql.raw(`ALTER TYPE "${name}" ADD VALUE IF NOT EXISTS '${value}';`))
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const name of ENUMS) {
    await db.execute(
      sql.raw(`
      DO $$
      DECLARE r record;
      BEGIN
        ALTER TYPE "${name}" RENAME TO "${name}_old";
        CREATE TYPE "${name}" AS ENUM ('en', 'th');
        FOR r IN
          SELECT c.relname AS tbl, a.attname AS col, pg_get_expr(d.adbin, d.adrelid) AS def
          FROM pg_attribute a
          JOIN pg_class c ON c.oid = a.attrelid
          JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = current_schema()
          LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
          WHERE a.atttypid = '"${name}_old"'::regtype AND c.relkind = 'r' AND NOT a.attisdropped
        LOOP
          IF r.def IS NOT NULL THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I DROP DEFAULT', r.tbl, r.col);
          END IF;
          EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE "${name}" USING %I::text::"${name}"', r.tbl, r.col, r.col);
          IF r.def IS NOT NULL THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I SET DEFAULT %s', r.tbl, r.col, replace(r.def, '${name}_old', '${name}'));
          END IF;
        END LOOP;
        DROP TYPE "${name}_old";
      END $$;`),
    )
  }
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Roles + version history for the site menu / footer.
//   users.role  (admin | approver | editor)  – every EXISTING account becomes 'admin' so nobody is locked out
//   users.name  – display name
//   _header_v*, _footer_v* – version-history tables for the Header and Footer globals (new, empty)
// Reverse path: `down` drops the new tables, the two users columns and the two enum types. Nothing else is
// touched; the only data lost on `down` is role/name values and any saved Header/Footer history.
// Generated from the schema Payload's dev-push produced, then verified on a scratch copy (see audit trail).
const UP: string[] = [
    "CREATE TYPE public.enum__footer_v_version_socials_platform AS ENUM (\n    'Facebook',\n    'Instagram',\n    'X',\n    'YouTube',\n    'LinkedIn',\n    'TikTok'\n);",
    "CREATE SEQUENCE public._footer_v_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._footer_v_locales_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._footer_v_version_hotlines_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._footer_v_version_hotlines_locales_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._footer_v_version_socials_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._header_v_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._header_v_locales_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._header_v_version_nav_items_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE SEQUENCE public._header_v_version_nav_items_locales_id_seq\n    AS integer\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1;",
    "CREATE TABLE public._footer_v (\n    id integer NOT NULL,\n    version_bank_verified_at timestamp(3) with time zone,\n    version_bank_verified_by character varying,\n    version_bank_account_name character varying,\n    version_bank_account_number character varying,\n    version_bank_swift character varying,\n    version_global_giving_project_url character varying,\n    version_global_giving_verified_at timestamp(3) with time zone,\n    version_global_giving_verified_by character varying,\n    version_updated_at timestamp(3) with time zone,\n    version_created_at timestamp(3) with time zone,\n    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,\n    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL\n);",
    "CREATE TABLE public._footer_v_locales (\n    version_address jsonb,\n    version_bank_details jsonb,\n    version_bank_name character varying,\n    id integer NOT NULL,\n    _locale public._locales NOT NULL,\n    _parent_id integer NOT NULL\n);",
    "CREATE TABLE public._footer_v_version_hotlines (\n    _order integer NOT NULL,\n    _parent_id integer NOT NULL,\n    id integer NOT NULL,\n    language character varying NOT NULL,\n    phone character varying NOT NULL,\n    verified_at timestamp(3) with time zone,\n    verified_by character varying,\n    _uuid character varying\n);",
    "CREATE TABLE public._footer_v_version_hotlines_locales (\n    availability character varying,\n    id integer NOT NULL,\n    _locale public._locales NOT NULL,\n    _parent_id integer NOT NULL\n);",
    "CREATE TABLE public._footer_v_version_socials (\n    _order integer NOT NULL,\n    _parent_id integer NOT NULL,\n    id integer NOT NULL,\n    platform public.enum__footer_v_version_socials_platform NOT NULL,\n    url character varying NOT NULL,\n    _uuid character varying\n);",
    "CREATE TABLE public._header_v (\n    id integer NOT NULL,\n    version_logo_id integer,\n    version_donate_href character varying DEFAULT '/donate'::character varying,\n    version_updated_at timestamp(3) with time zone,\n    version_created_at timestamp(3) with time zone,\n    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,\n    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL\n);",
    "CREATE TABLE public._header_v_locales (\n    version_donate_label character varying DEFAULT 'Donate'::character varying,\n    id integer NOT NULL,\n    _locale public._locales NOT NULL,\n    _parent_id integer NOT NULL\n);",
    "CREATE TABLE public._header_v_version_nav_items (\n    _order integer NOT NULL,\n    _parent_id integer NOT NULL,\n    id integer NOT NULL,\n    href character varying NOT NULL,\n    _uuid character varying\n);",
    "CREATE TABLE public._header_v_version_nav_items_locales (\n    label character varying NOT NULL,\n    id integer NOT NULL,\n    _locale public._locales NOT NULL,\n    _parent_id integer NOT NULL\n);",
    "ALTER SEQUENCE public._footer_v_id_seq OWNED BY public._footer_v.id;",
    "ALTER SEQUENCE public._footer_v_locales_id_seq OWNED BY public._footer_v_locales.id;",
    "ALTER SEQUENCE public._footer_v_version_hotlines_id_seq OWNED BY public._footer_v_version_hotlines.id;",
    "ALTER SEQUENCE public._footer_v_version_hotlines_locales_id_seq OWNED BY public._footer_v_version_hotlines_locales.id;",
    "ALTER SEQUENCE public._footer_v_version_socials_id_seq OWNED BY public._footer_v_version_socials.id;",
    "ALTER SEQUENCE public._header_v_id_seq OWNED BY public._header_v.id;",
    "ALTER SEQUENCE public._header_v_locales_id_seq OWNED BY public._header_v_locales.id;",
    "ALTER SEQUENCE public._header_v_version_nav_items_id_seq OWNED BY public._header_v_version_nav_items.id;",
    "ALTER SEQUENCE public._header_v_version_nav_items_locales_id_seq OWNED BY public._header_v_version_nav_items_locales.id;",
    "ALTER TABLE ONLY public._footer_v ALTER COLUMN id SET DEFAULT nextval('public._footer_v_id_seq'::regclass);",
    "ALTER TABLE ONLY public._footer_v_locales ALTER COLUMN id SET DEFAULT nextval('public._footer_v_locales_id_seq'::regclass);",
    "ALTER TABLE ONLY public._footer_v_version_hotlines ALTER COLUMN id SET DEFAULT nextval('public._footer_v_version_hotlines_id_seq'::regclass);",
    "ALTER TABLE ONLY public._footer_v_version_hotlines_locales ALTER COLUMN id SET DEFAULT nextval('public._footer_v_version_hotlines_locales_id_seq'::regclass);",
    "ALTER TABLE ONLY public._footer_v_version_socials ALTER COLUMN id SET DEFAULT nextval('public._footer_v_version_socials_id_seq'::regclass);",
    "ALTER TABLE ONLY public._header_v ALTER COLUMN id SET DEFAULT nextval('public._header_v_id_seq'::regclass);",
    "ALTER TABLE ONLY public._header_v_locales ALTER COLUMN id SET DEFAULT nextval('public._header_v_locales_id_seq'::regclass);",
    "ALTER TABLE ONLY public._header_v_version_nav_items ALTER COLUMN id SET DEFAULT nextval('public._header_v_version_nav_items_id_seq'::regclass);",
    "ALTER TABLE ONLY public._header_v_version_nav_items_locales ALTER COLUMN id SET DEFAULT nextval('public._header_v_version_nav_items_locales_id_seq'::regclass);",
    "ALTER TABLE ONLY public._footer_v_locales\n    ADD CONSTRAINT _footer_v_locales_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._footer_v\n    ADD CONSTRAINT _footer_v_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._footer_v_version_hotlines_locales\n    ADD CONSTRAINT _footer_v_version_hotlines_locales_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._footer_v_version_hotlines\n    ADD CONSTRAINT _footer_v_version_hotlines_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._footer_v_version_socials\n    ADD CONSTRAINT _footer_v_version_socials_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._header_v_locales\n    ADD CONSTRAINT _header_v_locales_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._header_v\n    ADD CONSTRAINT _header_v_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._header_v_version_nav_items_locales\n    ADD CONSTRAINT _header_v_version_nav_items_locales_pkey PRIMARY KEY (id);",
    "ALTER TABLE ONLY public._header_v_version_nav_items\n    ADD CONSTRAINT _header_v_version_nav_items_pkey PRIMARY KEY (id);",
    "CREATE INDEX _footer_v_created_at_idx ON public._footer_v USING btree (created_at);",
    "CREATE UNIQUE INDEX _footer_v_locales_locale_parent_id_unique ON public._footer_v_locales USING btree (_locale, _parent_id);",
    "CREATE INDEX _footer_v_updated_at_idx ON public._footer_v USING btree (updated_at);",
    "CREATE UNIQUE INDEX _footer_v_version_hotlines_locales_locale_parent_id_unique ON public._footer_v_version_hotlines_locales USING btree (_locale, _parent_id);",
    "CREATE INDEX _footer_v_version_hotlines_order_idx ON public._footer_v_version_hotlines USING btree (_order);",
    "CREATE INDEX _footer_v_version_hotlines_parent_id_idx ON public._footer_v_version_hotlines USING btree (_parent_id);",
    "CREATE INDEX _footer_v_version_socials_order_idx ON public._footer_v_version_socials USING btree (_order);",
    "CREATE INDEX _footer_v_version_socials_parent_id_idx ON public._footer_v_version_socials USING btree (_parent_id);",
    "CREATE INDEX _header_v_created_at_idx ON public._header_v USING btree (created_at);",
    "CREATE UNIQUE INDEX _header_v_locales_locale_parent_id_unique ON public._header_v_locales USING btree (_locale, _parent_id);",
    "CREATE INDEX _header_v_updated_at_idx ON public._header_v USING btree (updated_at);",
    "CREATE UNIQUE INDEX _header_v_version_nav_items_locales_locale_parent_id_unique ON public._header_v_version_nav_items_locales USING btree (_locale, _parent_id);",
    "CREATE INDEX _header_v_version_nav_items_order_idx ON public._header_v_version_nav_items USING btree (_order);",
    "CREATE INDEX _header_v_version_nav_items_parent_id_idx ON public._header_v_version_nav_items USING btree (_parent_id);",
    "CREATE INDEX _header_v_version_version_logo_idx ON public._header_v USING btree (version_logo_id);",
    "ALTER TABLE ONLY public._footer_v_locales\n    ADD CONSTRAINT _footer_v_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._footer_v(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._footer_v_version_hotlines_locales\n    ADD CONSTRAINT _footer_v_version_hotlines_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._footer_v_version_hotlines(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._footer_v_version_hotlines\n    ADD CONSTRAINT _footer_v_version_hotlines_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._footer_v(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._footer_v_version_socials\n    ADD CONSTRAINT _footer_v_version_socials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._footer_v(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._header_v_locales\n    ADD CONSTRAINT _header_v_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._header_v(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._header_v\n    ADD CONSTRAINT _header_v_version_logo_id_media_id_fk FOREIGN KEY (version_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;",
    "ALTER TABLE ONLY public._header_v_version_nav_items_locales\n    ADD CONSTRAINT _header_v_version_nav_items_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._header_v_version_nav_items(id) ON DELETE CASCADE;",
    "ALTER TABLE ONLY public._header_v_version_nav_items\n    ADD CONSTRAINT _header_v_version_nav_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._header_v(id) ON DELETE CASCADE;"
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'approver', 'editor');`))
  await db.execute(sql.raw(`ALTER TABLE "users" ADD COLUMN "name" varchar, ADD COLUMN "role" "public"."enum_users_role" DEFAULT 'editor' NOT NULL;`))
  await db.execute(sql.raw(`UPDATE "users" SET "role" = 'admin';`))
  for (const statement of UP) await db.execute(sql.raw(statement))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`DROP TABLE IF EXISTS "_header_v_version_nav_items_locales", "_header_v_version_nav_items", "_header_v_locales", "_header_v", "_footer_v_version_hotlines_locales", "_footer_v_version_hotlines", "_footer_v_version_socials", "_footer_v_locales", "_footer_v";`))
  await db.execute(sql.raw(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role", DROP COLUMN IF EXISTS "name";`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_users_role";`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum__footer_v_version_socials_platform";`))
}

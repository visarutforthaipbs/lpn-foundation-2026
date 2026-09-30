import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

// The existing LPN Payload database predates committed migrations. This
// baseline records its schema snapshot; its tables are already present.
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}

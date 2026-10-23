import * as migration_20260930_171225_baseline from './20260930_171225_baseline';
import * as migration_20260930_171314_prd_foundation from './20260930_171314_prd_foundation';
import * as migration_20260930_174518_story_image_approval from './20260930_174518_story_image_approval';
import * as migration_20260930_175004_report_topics from './20260930_175004_report_topics';
import * as migration_20261001_071311_us_online_giving from './20261001_071311_us_online_giving';
import * as migration_20261023_164500_team_name_localized from './20261023_164500_team_name_localized';
import * as migration_20261024_120000_migrant_locales from './20261024_120000_migrant_locales';

export const migrations = [
  {
    up: migration_20260930_171225_baseline.up,
    down: migration_20260930_171225_baseline.down,
    name: '20260930_171225_baseline',
  },
  {
    up: migration_20260930_171314_prd_foundation.up,
    down: migration_20260930_171314_prd_foundation.down,
    name: '20260930_171314_prd_foundation',
  },
  {
    up: migration_20260930_174518_story_image_approval.up,
    down: migration_20260930_174518_story_image_approval.down,
    name: '20260930_174518_story_image_approval',
  },
  {
    up: migration_20260930_175004_report_topics.up,
    down: migration_20260930_175004_report_topics.down,
    name: '20260930_175004_report_topics',
  },
  {
    up: migration_20261001_071311_us_online_giving.up,
    down: migration_20261001_071311_us_online_giving.down,
    name: '20261001_071311_us_online_giving'
  },
  {
    up: migration_20261023_164500_team_name_localized.up,
    down: migration_20261023_164500_team_name_localized.down,
    name: '20261023_164500_team_name_localized'
  },
  {
    up: migration_20261024_120000_migrant_locales.up,
    down: migration_20261024_120000_migrant_locales.down,
    name: '20261024_120000_migrant_locales'
  },
];

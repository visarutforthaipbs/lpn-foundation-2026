import * as migration_20260930_171225_baseline from './20260930_171225_baseline';
import * as migration_20260930_171314_prd_foundation from './20260930_171314_prd_foundation';
import * as migration_20260930_174518_story_image_approval from './20260930_174518_story_image_approval';
import * as migration_20260930_175004_report_topics from './20260930_175004_report_topics';

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
    name: '20260930_175004_report_topics'
  },
];

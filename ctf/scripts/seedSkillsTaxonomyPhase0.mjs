#!/usr/bin/env node

import { Pool } from 'pg';

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const pool = new Pool({
  connectionString: requireEnv('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
});

const seedData = {
  sectors: [
    {
      id: '51e2af64-b2df-4d73-9c08-4fd8a4110001',
      name: 'Software Engineering',
      displayOrder: 10,
      workforceShare: 38.5,
    },
    {
      id: '51e2af64-b2df-4d73-9c08-4fd8a4110002',
      name: 'Digital Operations',
      displayOrder: 20,
      workforceShare: 21.25,
    },
  ],
  jobTitles: [
    {
      id: '62e2af64-b2df-4d73-9c08-4fd8a4110001',
      sectorId: '51e2af64-b2df-4d73-9c08-4fd8a4110001',
      name: 'Frontend Engineer',
      displayOrder: 10,
    },
    {
      id: '62e2af64-b2df-4d73-9c08-4fd8a4110002',
      sectorId: '51e2af64-b2df-4d73-9c08-4fd8a4110001',
      name: 'Backend Engineer',
      displayOrder: 20,
    },
    {
      id: '62e2af64-b2df-4d73-9c08-4fd8a4110003',
      sectorId: '51e2af64-b2df-4d73-9c08-4fd8a4110002',
      name: 'Support Specialist',
      displayOrder: 10,
    },
  ],
  skills: [
    {
      id: '73e2af64-b2df-4d73-9c08-4fd8a4110001',
      jobTitleId: '62e2af64-b2df-4d73-9c08-4fd8a4110001',
      name: 'TypeScript',
      displayOrder: 10,
      aliases: ['ts'],
    },
    {
      id: '73e2af64-b2df-4d73-9c08-4fd8a4110002',
      jobTitleId: '62e2af64-b2df-4d73-9c08-4fd8a4110002',
      name: 'PostgreSQL',
      displayOrder: 10,
      aliases: ['postgres'],
    },
    {
      id: '73e2af64-b2df-4d73-9c08-4fd8a4110003',
      jobTitleId: '62e2af64-b2df-4d73-9c08-4fd8a4110003',
      name: 'Customer Incident Triage',
      displayOrder: 10,
      aliases: [],
    },
  ],
  bindings: [
    {
      id: '84e2af64-b2df-4d73-9c08-4fd8a4110001',
      consumerName: 'directory',
      targetType: 'skill',
      targetId: '73e2af64-b2df-4d73-9c08-4fd8a4110001',
      referenceCount: 1,
    },
  ],
};

async function main() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const sector of seedData.sectors) {
      await client.query(
        `
          INSERT INTO skills_taxonomy_sectors (id, name, display_order, workforce_share, is_active)
          VALUES ($1, $2, $3, $4, true)
          ON CONFLICT (id)
          DO UPDATE SET
            name = EXCLUDED.name,
            display_order = EXCLUDED.display_order,
            workforce_share = EXCLUDED.workforce_share,
            is_active = true,
            updated_at = NOW()
        `,
        [sector.id, sector.name, sector.displayOrder, sector.workforceShare],
      );
    }

    for (const jobTitle of seedData.jobTitles) {
      await client.query(
        `
          INSERT INTO skills_taxonomy_job_titles (id, sector_id, name, display_order, is_active)
          VALUES ($1, $2, $3, $4, true)
          ON CONFLICT (id)
          DO UPDATE SET
            sector_id = EXCLUDED.sector_id,
            name = EXCLUDED.name,
            display_order = EXCLUDED.display_order,
            is_active = true,
            updated_at = NOW()
        `,
        [jobTitle.id, jobTitle.sectorId, jobTitle.name, jobTitle.displayOrder],
      );
    }

    for (const skill of seedData.skills) {
      await client.query(
        `
          INSERT INTO skills_taxonomy_skills (id, job_title_id, name, display_order, aliases, is_active)
          VALUES ($1, $2, $3, $4, $5::jsonb, true)
          ON CONFLICT (id)
          DO UPDATE SET
            job_title_id = EXCLUDED.job_title_id,
            name = EXCLUDED.name,
            display_order = EXCLUDED.display_order,
            aliases = EXCLUDED.aliases,
            is_active = true,
            updated_at = NOW()
        `,
        [skill.id, skill.jobTitleId, skill.name, skill.displayOrder, JSON.stringify(skill.aliases)],
      );
    }

    for (const binding of seedData.bindings) {
      await client.query(
        `
          INSERT INTO skills_taxonomy_consumer_bindings (id, consumer_name, target_type, target_id, reference_count, metadata)
          VALUES ($1, $2, $3, $4, $5, '{"seed":true}'::jsonb)
          ON CONFLICT (id)
          DO UPDATE SET
            consumer_name = EXCLUDED.consumer_name,
            target_type = EXCLUDED.target_type,
            target_id = EXCLUDED.target_id,
            reference_count = EXCLUDED.reference_count,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        `,
        [binding.id, binding.consumerName, binding.targetType, binding.targetId, binding.referenceCount],
      );
    }

    await client.query('COMMIT');
    console.log('Skills taxonomy phase-0 seed fixtures applied.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

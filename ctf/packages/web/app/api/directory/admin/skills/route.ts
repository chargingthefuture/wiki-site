import { NextResponse } from 'next/server';
import { requireDirectoryAdminAccess } from '../../_lib';
import { DIRECTORY_ERROR_CODE } from 'lib/directory/constants';
import { listTaxonomyJobTitles, listTaxonomySectors, listTaxonomySkills } from 'lib/directory/repository';

export async function GET() {
  const gate = await requireDirectoryAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const [sectors, jobTitles, skills] = await Promise.all([
      listTaxonomySectors(),
      listTaxonomyJobTitles(),
      listTaxonomySkills(),
    ]);

    return NextResponse.json(
      {
        sectors,
        jobTitles,
        skills,
        selectorCompatibility: {
          sectors: sectors.length,
          jobTitles: jobTitles.length,
          skills: skills.length,
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch skills compatibility.' },
      { status: 503 },
    );
  }
}

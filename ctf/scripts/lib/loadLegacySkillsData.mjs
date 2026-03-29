import fs from 'node:fs/promises';
import vm from 'node:vm';

export function normalizeTaxonomyName(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function dedupeNames(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = normalizeTaxonomyName(value);
    if (normalized.length === 0) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function parseSkillsArrayLiteral(fileText, filePath) {
  const match = fileText.match(/export\s+const\s+skillsData[\s\S]*?=\s*(\[[\s\S]*\]);\s*$/m);
  if (!match) {
    throw new Error(`Unable to parse skillsData export in ${filePath}.`);
  }

  const arrayLiteral = match[1];
  const script = new vm.Script(`(${arrayLiteral})`, { filename: filePath });
  const parsed = script.runInNewContext(Object.create(null), { timeout: 2000 });

  if (!Array.isArray(parsed)) {
    throw new Error(`skillsData export is not an array in ${filePath}.`);
  }

  return parsed;
}

export async function loadLegacySkillsData(filePath) {
  const fileText = await fs.readFile(filePath, 'utf8');
  const rawData = parseSkillsArrayLiteral(fileText, filePath);

  const normalized = rawData.map((entry) => {
    const sectorName = normalizeTaxonomyName(String(entry?.sector?.name ?? ''));
    const workforceShareCandidate = Number(entry?.sector?.estimatedWorkforceShare);
    const workforceShare = Number.isFinite(workforceShareCandidate) ? workforceShareCandidate : null;
    const sectorDisplayOrder = Number.isFinite(Number(entry?.sector?.displayOrder))
      ? Number(entry.sector.displayOrder)
      : 0;

    const jobTitles = Array.isArray(entry?.jobTitles)
      ? entry.jobTitles.map((jobTitle) => {
        const jobTitleName = normalizeTaxonomyName(String(jobTitle?.name ?? ''));
        const displayOrder = Number.isFinite(Number(jobTitle?.displayOrder))
          ? Number(jobTitle.displayOrder)
          : 0;

        const skills = Array.isArray(jobTitle?.skills)
          ? dedupeNames(jobTitle.skills.filter((skill) => typeof skill === 'string'))
          : [];

        return {
          name: jobTitleName,
          displayOrder,
          skills,
        };
      })
      : [];

    return {
      sector: {
        name: sectorName,
        workforceShare,
        displayOrder: sectorDisplayOrder,
      },
      jobTitles,
    };
  });

  return normalized.filter((entry) => entry.sector.name.length > 0);
}

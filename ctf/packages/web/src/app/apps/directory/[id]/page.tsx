import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicDirectoryById } from '@/src/lib/directory/repository';

type DirectoryProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DirectoryProfilePage({ params }: DirectoryProfilePageProps) {
  const { id } = await params;

  const profile = await getPublicDirectoryById(id);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/apps/directory" className="text-sm text-blue-600 hover:underline">
          ← Back to Directory
        </Link>
      </div>

      {/* Profile header */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{profile.displayName}</h1>
          {profile.headline && <p className="text-lg text-muted-foreground mt-2">{profile.headline}</p>}
        </div>

        {/* Selectors */}
        <div className="flex flex-wrap gap-2">
          {profile.sectorName && (
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
              {profile.sectorName}
            </span>
          )}
          {profile.jobTitleName && (
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
              {profile.jobTitleName}
            </span>
          )}
        </div>

        {/* Bio */}
        {profile.bio && <p className="text-base leading-relaxed whitespace-pre-wrap">{profile.bio}</p>}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2">Skills</h3>
            <ul className="space-y-1">
              {profile.skills.map((skill) => (
                <li key={skill.id} className="text-sm text-muted-foreground">
                  • {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment addresses */}
        <div className="border-t pt-4 space-y-2">
          <h3 className="font-medium text-sm">Payment Methods</h3>
          <div className="text-sm space-y-1">
            {profile.venmoAddress && <p>Venmo: <code className="bg-slate-50 px-2 py-1 rounded">{profile.venmoAddress}</code></p>}
            {profile.bitcoinAddress && <p>Bitcoin: <code className="bg-slate-50 px-2 py-1 rounded text-xs">{profile.bitcoinAddress}</code></p>}
            {profile.moneroAddress && <p>Monero: <code className="bg-slate-50 px-2 py-1 rounded text-xs">{profile.moneroAddress}</code></p>}
            {profile.serviceCreditsAddress && <p>Service Credits: <code className="bg-slate-50 px-2 py-1 rounded">{profile.serviceCreditsAddress}</code></p>}
            {!profile.venmoAddress && !profile.bitcoinAddress && !profile.moneroAddress && !profile.serviceCreditsAddress && (
              <p className="text-muted-foreground">No payment methods listed</p>
            )}
          </div>
        </div>

        {/* External link */}
        {profile.profileUrl && (
          <div className="border-t pt-4">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View profile website →
            </a>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <p>Profile ID: {id}</p>
          <p>Updated: {new Date(profile.updatedAtIso).toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}

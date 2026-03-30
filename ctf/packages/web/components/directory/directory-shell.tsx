import Link from 'next/link';
import {
  getOwnProfile,
  listAdminProfiles,
  listDirectoryAnnouncements,
  listDirectoryForMember,
} from '../lib/directory/repository';
import type { DirectoryAnnouncement, DirectoryProfile } from '../lib/directory/types';

type DirectoryShellProps = {
  userId: string;
  isAdmin: boolean;
};

type MemberListPayload = {
  items: DirectoryProfile[];
  pagination: { page: number; pageSize: number; total: number };
};

function OwnProfileSection({ ownProfile }: { ownProfile: DirectoryProfile | null }) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Your Profile</h2>
      {ownProfile ? (
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Display:</span> {ownProfile.displayName}</p>
          <p><span className="font-medium">Visibility:</span> {ownProfile.isPublic ? 'Public' : 'Workspace'}</p>
          <p><span className="font-medium">Selectors:</span> {ownProfile.sectorName ?? '—'} / {ownProfile.jobTitleName ?? '—'} / {ownProfile.skills.length} skills</p>
        </div>
      ) : (
        <div className="text-sm space-y-2">
          <p>No profile yet. Create your directory profile to unlock member directory browsing.</p>
          <p className="text-muted-foreground">API behavior is locked: `GET /api/directory/list` returns `404` until profile exists.</p>
        </div>
      )}
    </section>
  );
}

function MemberDirectorySection({ listPayload }: { listPayload: MemberListPayload }) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Member Directory</h2>
      <p className="text-sm text-muted-foreground">Showing {listPayload.items.length} of {listPayload.pagination.total} records.</p>
      <ul className="space-y-2 text-sm">
        {listPayload.items.map((profile) => (
          <li key={profile.id} className="rounded border p-3">
            <p className="font-medium">{profile.displayName}</p>
            <p className="text-muted-foreground">{profile.headline ?? 'No headline'}</p>
          </li>
        ))}
        {listPayload.items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No visible directory profiles yet.</li>
        ) : null}
      </ul>
    </section>
  );
}

function AnnouncementSection({ announcements }: { announcements: DirectoryAnnouncement[] }) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Announcements</h2>
      <ul className="space-y-2 text-sm">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="rounded border p-3">
            <p className="font-medium">{announcement.title}</p>
            <p className="text-muted-foreground">{announcement.body}</p>
          </li>
        ))}
        {announcements.length === 0 ? (
          <li className="text-sm text-muted-foreground">No active announcements.</li>
        ) : null}
      </ul>
    </section>
  );
}

function AdminSection({
  adminProfiles,
  adminAnnouncements,
}: {
  adminProfiles: MemberListPayload;
  adminAnnouncements: DirectoryAnnouncement[];
}) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="text-lg font-medium">Admin Controls (Role-gated)</h2>
      <p className="text-sm text-muted-foreground">
        Admin write routes require role + CSRF and enforce unclaimed-only delete guardrails.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded border p-3 text-sm space-y-2">
          <p className="font-medium">Profiles</p>
          <p>Total loaded: {adminProfiles.pagination.total}</p>
          <p>First page records: {adminProfiles.items.length}</p>
          <p className="text-muted-foreground">Use `/api/directory/admin/profiles` and `/assign` to manage claimed/unclaimed lifecycle.</p>
        </article>

        <article className="rounded border p-3 text-sm space-y-2">
          <p className="font-medium">Announcements</p>
          <p>Total loaded: {adminAnnouncements.length}</p>
          <p className="text-muted-foreground">Use `/api/directory/admin/announcements` for create/update/deactivate.</p>
        </article>
      </div>
    </section>
  );
}

export async function DirectoryShell({ userId, isAdmin }: DirectoryShellProps) {
  const ownProfile = await getOwnProfile(userId);

  const listPayload = ownProfile
    ? await listDirectoryForMember(userId, { page: 1, pageSize: 20 }, {})
    : { items: [], pagination: { page: 1, pageSize: 20, total: 0 } };

  const announcements = await listDirectoryAnnouncements(true);
  const adminProfiles = isAdmin
    ? await listAdminProfiles({ page: 1, pageSize: 20 }, true)
    : null;
  const adminAnnouncements = isAdmin
    ? await listDirectoryAnnouncements(false)
    : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Directory</h1>
        <p className="text-sm text-muted-foreground">
          Unified member/admin surface with role-gated controls and policy-backed routes.
        </p>
      </header>

      <OwnProfileSection ownProfile={ownProfile} />
      <MemberDirectorySection listPayload={listPayload} />
      <AnnouncementSection announcements={announcements} />
      {isAdmin && adminProfiles && adminAnnouncements ? (
        <AdminSection adminProfiles={adminProfiles} adminAnnouncements={adminAnnouncements} />
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

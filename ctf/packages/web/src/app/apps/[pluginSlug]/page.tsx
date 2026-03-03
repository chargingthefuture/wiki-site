import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { canonicalizePluginSlug, getPluginBySlug } from '@/src/lib/plugins/repository';
import { ChymeShell } from '@/src/components/chyme/chyme-shell';
import { DirectoryShell } from '@/src/components/directory/directory-shell';
import { FeedAnnouncementsShell } from '@/src/components/feed/feed-announcements-shell';
import { FoundationShell } from '@/src/components/foundation/foundation-shell';
import { LighthouseShell } from '@/src/components/lighthouse/lighthouse-shell';
import { SocketRelayShell } from '@/src/components/socketrelay/socketrelay-shell';
import { SkillsHuntShell } from '@/src/components/skills-hunt/skills-hunt-shell';
import { TrustTransportShell } from '@/src/components/trusttransport/trusttransport-shell';
import { WorkforceShell } from '@/src/components/workforce/workforce-shell';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PluginRoutePageProps = {
  params: Promise<{
    pluginSlug: string;
  }>;
};

type AccessDeniedProps = {
  status: number;
  code: string;
  reason: string;
  requestedPluginSlug: string;
};

function AccessDeniedView({ status, code, reason, requestedPluginSlug }: AccessDeniedProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Plugin access denied</h1>
      <p className="text-sm text-muted-foreground">
        Request blocked by baseline plugin auth policy.
      </p>
      <dl className="rounded-lg border bg-card p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="font-medium">HTTP status</dt>
          <dd>{status}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Deny code</dt>
          <dd>{code}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Reason</dt>
          <dd>{reason}</dd>
        </div>
      </dl>
      <p>Requested plugin: {requestedPluginSlug}</p>
      {reason === 'missing_username' ? (
        <p className="text-sm">
          Username is required for this plugin route. Open your Clerk profile avatar and select
          {' '}Update username.
        </p>
      ) : null}
      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

type GenericPluginViewProps = {
  userId: string;
  username: string | null;
  selectedPluginSlug: string;
  selectedPluginName: string;
  selectedPluginStartGate: string;
  availabilityState: string;
};

function GenericPluginView({
  userId,
  username,
  selectedPluginSlug,
  selectedPluginName,
  selectedPluginStartGate,
  availabilityState,
}: GenericPluginViewProps) {
  const isPlanned = availabilityState === 'planned';

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isPlanned ? 'Plugin route active (planned implementation)' : 'Plugin baseline access confirmed'}
      </h1>
      <p className="text-sm text-muted-foreground">
        Route access passed middleware and server-side policy checks.
      </p>
      <dl className="rounded-lg border bg-card p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="font-medium">Authenticated user</dt>
          <dd>{userId}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Username handle</dt>
          <dd>{username ?? 'not set'}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Selected plugin</dt>
          <dd>{selectedPluginName}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Start gate</dt>
          <dd>{selectedPluginStartGate}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="font-medium">Availability</dt>
          <dd>{availabilityState}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">Selected plugin slug: {selectedPluginSlug}</p>
      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

export default async function PluginRoutePage({ params }: PluginRoutePageProps) {
  const resolvedParams = await params;
  const requestedPluginSlug = canonicalizePluginSlug(resolvedParams.pluginSlug);
  const selectedPlugin = await getPluginBySlug(requestedPluginSlug);

  if (!selectedPlugin || !selectedPlugin.isVisible) {
    notFound();
  }

  const shouldRequireUsername = selectedPlugin.slug !== 'chyme';
  const decision = await evaluatePluginAccess({ requireUsername: shouldRequireUsername });

  if (!decision.allowed) {
    return (
      <AccessDeniedView
        status={decision.status}
        code={decision.code}
        reason={decision.reason}
        requestedPluginSlug={selectedPlugin.slug}
      />
    );
  }

  if (selectedPlugin.slug === 'chyme') {
    return <ChymeShell />;
  }

  if (selectedPlugin.slug === 'directory') {
    return <DirectoryShell userId={decision.userId} isAdmin={decision.isAdmin} />;
  }

  if (selectedPlugin.slug === 'feed-announcements') {
    return (
      <FeedAnnouncementsShell
        userId={decision.userId}
        role={decision.role}
        isAdmin={decision.isAdmin}
      />
    );
  }

  if (selectedPlugin.slug === 'workforce') {
    return <WorkforceShell isAdmin={decision.isAdmin} />;
  }

  if (selectedPlugin.slug === 'skills-hunt') {
    return <SkillsHuntShell userId={decision.userId} isAdmin={decision.isAdmin} isModerator={decision.role === 'moderator'} />;
  }

  if (selectedPlugin.slug === 'foundation') {
    return <FoundationShell userId={decision.userId} isAdmin={decision.isAdmin} />;
  }

  if (selectedPlugin.slug === 'lighthouse') {
    return <LighthouseShell userId={decision.userId} isAdmin={decision.isAdmin} role={decision.role} />;
  }

  if (selectedPlugin.slug === 'socketrelay') {
    return <SocketRelayShell userId={decision.userId} isAdmin={decision.isAdmin} role={decision.role} />;
  }

  if (selectedPlugin.slug === 'trusttransport') {
    return <TrustTransportShell userId={decision.userId} isAdmin={decision.isAdmin} />;
  }

  return (
    <GenericPluginView
      userId={decision.userId}
      username={decision.username}
      selectedPluginSlug={selectedPlugin.slug}
      selectedPluginName={selectedPlugin.name}
      selectedPluginStartGate={selectedPlugin.startGate}
      availabilityState={selectedPlugin.availabilityState}
    />
  );
}

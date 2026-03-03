import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { nonBaselinePlugins } from '@/src/lib/plugins/plugin-catalog';
import { ChymeShell } from '@/src/components/chyme/chyme-shell';
import { DirectoryShell } from '@/src/components/directory/directory-shell';
import { FeedAnnouncementsShell } from '@/src/components/feed/feed-announcements-shell';
import { SkillsHuntShell } from '@/src/components/skills-hunt/skills-hunt-shell';
import { WorkforceShell } from '@/src/components/workforce/workforce-shell';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PluginPageProps = {
  searchParams?: Promise<{
    plugin?: string | string[];
  }>;
};

function getRequestedPluginId(pluginValue: string | string[] | undefined): string | null {
  if (Array.isArray(pluginValue)) {
    return pluginValue[0] ?? null;
  }

  return pluginValue ?? null;
}

type PluginContext = {
  requestedPluginId: string | null;
  selectedPluginName: string | null;
  selectedPluginStartGate: string | null;
  shouldRequireUsername: boolean;
  showChymeView: boolean;
  showDirectoryView: boolean;
  showFeedAnnouncementsView: boolean;
  showWorkforceView: boolean;
  showSkillsHuntView: boolean;
  pluginIdKnown: boolean;
};

function resolveSelectedPlugin(requestedPluginId: string | null) {
  if (!requestedPluginId) {
    return null;
  }

  return nonBaselinePlugins.find((plugin) => plugin.id === requestedPluginId) ?? null;
}

function shouldRequireUsername(requestedPluginId: string | null, selectedPluginId: string | null): boolean {
  if (!requestedPluginId) {
    return false;
  }

  return selectedPluginId !== 'chyme';
}

function buildPluginContext(pluginValue: string | string[] | undefined): PluginContext {
  const requestedPluginId = getRequestedPluginId(pluginValue);
  const selectedPlugin = resolveSelectedPlugin(requestedPluginId);
  const selectedPluginId = selectedPlugin?.id ?? null;
  const hasRequestedPluginId = Boolean(requestedPluginId);

  return {
    requestedPluginId,
    selectedPluginName: selectedPlugin?.name ?? null,
    selectedPluginStartGate: selectedPlugin?.startGate ?? null,
    shouldRequireUsername: shouldRequireUsername(requestedPluginId, selectedPluginId),
    showChymeView: selectedPluginId === 'chyme' || !hasRequestedPluginId,
    showDirectoryView: selectedPluginId === 'directory',
    showFeedAnnouncementsView: selectedPluginId === 'feed-announcements',
    showWorkforceView: selectedPluginId === 'workforce',
    showSkillsHuntView: selectedPluginId === 'skills-hunt',
    pluginIdKnown: !hasRequestedPluginId || Boolean(selectedPlugin),
  };
}

type AccessDeniedProps = {
  status: number;
  code: string;
  reason: string;
  requestedPluginId: string | null;
};

function AccessDeniedView({ status, code, reason, requestedPluginId }: AccessDeniedProps) {
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
      {requestedPluginId ? <p>Requested plugin: {requestedPluginId}</p> : null}
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
  requestedPluginId: string | null;
  selectedPluginName: string | null;
  selectedPluginStartGate: string | null;
};

function GenericPluginView({
  userId,
  username,
  requestedPluginId,
  selectedPluginName,
  selectedPluginStartGate,
}: GenericPluginViewProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Plugin baseline access confirmed</h1>
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
        {selectedPluginName ? (
          <>
            <div className="mt-2 flex justify-between gap-4">
              <dt className="font-medium">Selected plugin</dt>
              <dd>{selectedPluginName}</dd>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <dt className="font-medium">Start gate</dt>
              <dd>{selectedPluginStartGate ?? 'n/a'}</dd>
            </div>
          </>
        ) : null}
      </dl>
      {requestedPluginId ? (
        <p className="text-sm text-muted-foreground">
          Selected plugin id: {requestedPluginId}
        </p>
      ) : null}
      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

export default async function PluginPage({ searchParams }: PluginPageProps) {
  const resolvedSearchParams = await searchParams;
  const pluginContext = buildPluginContext(resolvedSearchParams?.plugin);

  if (!pluginContext.pluginIdKnown) {
    notFound();
  }

  const decision = await evaluatePluginAccess({ requireUsername: pluginContext.shouldRequireUsername });

  if (!decision.allowed) {
    return (
      <AccessDeniedView
        status={decision.status}
        code={decision.code}
        reason={decision.reason}
        requestedPluginId={pluginContext.requestedPluginId}
      />
    );
  }

  if (pluginContext.showChymeView) {
    return <ChymeShell />;
  }

  if (pluginContext.showDirectoryView) {
    return <DirectoryShell userId={decision.userId} isAdmin={decision.isAdmin} />;
  }

  if (pluginContext.showFeedAnnouncementsView) {
    return (
      <FeedAnnouncementsShell
        userId={decision.userId}
        role={decision.role}
        isAdmin={decision.isAdmin}
      />
    );
  }

  if (pluginContext.showWorkforceView) {
    return <WorkforceShell isAdmin={decision.isAdmin} />;
  }

  if (pluginContext.showSkillsHuntView) {
    return <SkillsHuntShell userId={decision.userId} isAdmin={decision.isAdmin} isModerator={decision.role === 'moderator'} />;
  }

  return (
    <GenericPluginView
      userId={decision.userId}
      username={decision.username}
      requestedPluginId={pluginContext.requestedPluginId}
      selectedPluginName={pluginContext.selectedPluginName}
      selectedPluginStartGate={pluginContext.selectedPluginStartGate}
    />
  );
}

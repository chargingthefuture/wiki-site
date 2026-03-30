import { NextResponse } from 'next/server';
import { listPluginRegistryWithSummary } from '../lib/plugins/repository';

export async function GET() {
  try {
    const { plugins, summary } = await listPluginRegistryWithSummary();
    return NextResponse.json({ plugins, summary }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: 'plugin_registry_unavailable',
        message: 'Unable to load plugin registry.',
      },
      { status: 503 },
    );
  }
}

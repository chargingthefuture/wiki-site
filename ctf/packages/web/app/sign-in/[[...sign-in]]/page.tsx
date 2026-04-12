import { redirect } from 'next/navigation';

// Sign-in is handled by the hosted account flow outside this app surface.
// This page remains as a catch-all for legacy links or misconfigured redirects.
export default function SignInPage() {
  redirect('/apps');
}

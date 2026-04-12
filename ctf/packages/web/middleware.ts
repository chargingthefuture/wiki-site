import type { NextFetchEvent } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

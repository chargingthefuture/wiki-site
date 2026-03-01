import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { getClerkRuntimeOptions } from './lib/auth/clerk-env';

const isProtectedWebRoute = createRouteMatcher(['/plugin(.*)', '/admin(.*)']);
const clerkRuntimeOptions = getClerkRuntimeOptions();

export default clerkMiddleware((auth, req) => {
  if (isProtectedWebRoute(req)) {
    auth().protect();
  }
}, clerkRuntimeOptions);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

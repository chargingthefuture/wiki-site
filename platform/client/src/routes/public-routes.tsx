/**
 * Public routes - accessible without authentication
 */

import { Route } from "wouter";
import PublicDirectoryList from "@/pages/directory/public-list";
import PublicDirectoryProfile from "@/pages/directory/public";
import PublicSocketRelayList from "@/pages/socketrelay/public-list";
import PublicSocketRelayRequest from "@/pages/socketrelay/public";
import Terms from "@/pages/terms";

export function PublicRoutes() {
  return (
    <>
      {/* Publicly viewable Directory profiles */}
      <Route path="/apps/directory/public" component={PublicDirectoryList} />
      <Route path="/apps/directory/public/:id" component={PublicDirectoryProfile} />
      {/* Publicly viewable SocketRelay requests */}
      <Route path="/apps/socketrelay/public" component={PublicSocketRelayList} />
      <Route path="/apps/socketrelay/public/:id" component={PublicSocketRelayRequest} />
      {/* Public Terms page */}
      <Route path="/terms" component={Terms} />
    </>
  );
}

export function registerPublicRoutes() {
  return <PublicRoutes />;
}

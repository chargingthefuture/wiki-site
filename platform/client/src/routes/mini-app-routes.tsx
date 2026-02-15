/**
 * Mini-app routes - all protected routes for various mini-apps
 */

import { Route } from "wouter";
import { ProtectedRoute, ChymeRoomRoute } from "./route-wrappers";
import SupportMatchDashboard from "@/pages/supportmatch/dashboard";
import SupportMatchProfile from "@/pages/supportmatch/profile";
import SupportMatchPartnership from "@/pages/supportmatch/partnership";
import SupportMatchAnnouncements from "@/pages/supportmatch/announcements";
import SupportMatchHistory from "@/pages/supportmatch/history";
import SupportMatchSafety from "@/pages/supportmatch/safety";
import SupportMatchAdmin from "@/pages/supportmatch/admin";
import SupportMatchAdminAnnouncements from "@/pages/supportmatch/admin-announcements";
import SupportMatchAdminUsers from "@/pages/supportmatch/admin-users";
import SupportMatchAdminPartnerships from "@/pages/supportmatch/admin-partnerships";
import SupportMatchAdminReports from "@/pages/supportmatch/admin-reports";
import LighthouseDashboard from "@/pages/lighthouse/dashboard";
import LighthouseProfile from "@/pages/lighthouse/profile";
import LighthouseBrowse from "@/pages/lighthouse/browse";
import LighthousePropertyDetail from "@/pages/lighthouse/property-detail";
import LighthouseMatches from "@/pages/lighthouse/matches";
import LighthouseAdmin from "@/pages/lighthouse/admin";
import LighthouseMyProperties from "@/pages/lighthouse/my-properties";
import LighthousePropertyForm from "@/pages/lighthouse/property-form";
import LighthouseAdminAnnouncements from "@/pages/lighthouse/admin-announcements";
import LighthouseAdminProfileView from "@/pages/lighthouse/admin-profile-view";
import LighthouseAnnouncements from "@/pages/lighthouse/announcements";
import SocketRelayDashboard from "@/pages/socketrelay/dashboard";
import SocketRelayProfile from "@/pages/socketrelay/profile";
import SocketRelayChat from "@/pages/socketrelay/chat";
import SocketRelayAdmin from "@/pages/socketrelay/admin";
import SocketRelayAnnouncements from "@/pages/socketrelay/announcements";
import SocketRelayAdminAnnouncements from "@/pages/socketrelay/admin-announcements";
import DirectoryDashboard from "@/pages/directory/dashboard";
import DirectoryProfile from "@/pages/directory/profile";
import DirectoryAdmin from "@/pages/directory/admin";
import DirectoryAnnouncements from "@/pages/directory/announcements";
import DirectoryAdminAnnouncements from "@/pages/directory/admin-announcements";
import TrustTransportDashboard from "@/pages/trusttransport/dashboard";
import TrustTransportProfile from "@/pages/trusttransport/profile";
import TrustTransportBrowse from "@/pages/trusttransport/browse";
import TrustTransportRequestNew from "@/pages/trusttransport/request-new";
import TrustTransportRequestDetail from "@/pages/trusttransport/request-detail";
import TrustTransportMyRequests from "@/pages/trusttransport/my-requests";
import TrustTransportMyClaimed from "@/pages/trusttransport/my-claimed";
import TrustTransportAnnouncements from "@/pages/trusttransport/announcements";
import TrustTransportAdmin from "@/pages/trusttransport/admin";
import TrustTransportAdminAnnouncements from "@/pages/trusttransport/admin-announcements";
import GentlePulseLibrary from "@/pages/gentlepulse/library";
import GentlePulseSupport from "@/pages/gentlepulse/support";
import GentlePulseSettings from "@/pages/gentlepulse/settings";
import GentlePulseAdmin from "@/pages/gentlepulse/admin";
import GentlePulseAdminAnnouncements from "@/pages/gentlepulse/admin-announcements";
import GentlePulseAnnouncements from "@/pages/gentlepulse/announcements";
import MoodPage from "@/pages/mood";
import MoodAdmin from "@/pages/mood/admin";
import MoodAdminAnnouncements from "@/pages/mood/admin-announcements";
import ChymeDashboard from "@/pages/chyme/dashboard";
import ChymeAdmin from "@/pages/chyme/admin";
import ChymeAdminAnnouncements from "@/pages/chyme/admin-announcements";
import ChymeAnnouncements from "@/pages/chyme/announcements";
import ChymeRoomDetail from "@/pages/chyme/room";
import WorkforceRecruiterDashboard from "@/pages/workforce-recruiter/dashboard";
import WorkforceRecruiterProfile from "@/pages/workforce-recruiter/profile";
import WorkforceRecruiterOccupations from "@/pages/workforce-recruiter/occupations";
import WorkforceRecruiterOccupationDetail from "@/pages/workforce-recruiter/occupation-detail";
import WorkforceRecruiterReports from "@/pages/workforce-recruiter/reports";
import WorkforceRecruiterAdmin from "@/pages/workforce-recruiter/admin";
import WorkforceRecruiterAdminAnnouncements from "@/pages/workforce-recruiter/admin-announcements";
import WorkforceRecruiterAnnouncements from "@/pages/workforce-recruiter/announcements";
import WorkforceRecruiterConfig from "@/pages/workforce-recruiter/config";
import WorkforceRecruiterAdminOccupations from "@/pages/workforce-recruiter/admin-occupations";
import WorkforceRecruiterSkillLevelDetail from "@/pages/workforce-recruiter/skill-level-detail";
import DefaultAliveOrDeadDashboard from "@/pages/default-alive-or-dead/dashboard";
import DefaultAliveOrDeadAdmin from "@/pages/default-alive-or-dead/admin";

export function MiniAppRoutes() {
  return (
    <>
      {/* SupportMatch routes */}
      <Route path="/apps/supportmatch">
        <ProtectedRoute>
          <SupportMatchDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/profile">
        <ProtectedRoute>
          <SupportMatchProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/partnership">
        <ProtectedRoute>
          <SupportMatchPartnership />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/announcements">
        <ProtectedRoute>
          <SupportMatchAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/history">
        <ProtectedRoute>
          <SupportMatchHistory />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/safety">
        <ProtectedRoute>
          <SupportMatchSafety />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/admin">
        <ProtectedRoute>
          <SupportMatchAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/admin/announcements">
        <ProtectedRoute>
          <SupportMatchAdminAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/admin/users">
        <ProtectedRoute>
          <SupportMatchAdminUsers />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/admin/partnerships">
        <ProtectedRoute>
          <SupportMatchAdminPartnerships />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/supportmatch/admin/reports">
        <ProtectedRoute>
          <SupportMatchAdminReports />
        </ProtectedRoute>
      </Route>

      {/* Lighthouse routes */}
      <Route path="/apps/lighthouse">
        <ProtectedRoute>
          <LighthouseDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/profile">
        <ProtectedRoute>
          <LighthouseProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/browse">
        <ProtectedRoute>
          <LighthouseBrowse />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/my-properties">
        <ProtectedRoute>
          <LighthouseMyProperties />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/property/new">
        <ProtectedRoute>
          <LighthousePropertyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/property/edit/:id">
        <ProtectedRoute>
          <LighthousePropertyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/property/:id">
        <ProtectedRoute>
          <LighthousePropertyDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/matches">
        <ProtectedRoute>
          <LighthouseMatches />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/admin">
        <ProtectedRoute>
          <LighthouseAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/admin/profile/:id">
        <ProtectedRoute>
          <LighthouseAdminProfileView />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/admin/announcements">
        <ProtectedRoute>
          <LighthouseAdminAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/lighthouse/announcements">
        <ProtectedRoute>
          <LighthouseAnnouncements />
        </ProtectedRoute>
      </Route>

      {/* SocketRelay routes */}
      <Route path="/apps/socketrelay">
        <ProtectedRoute>
          <SocketRelayDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/socketrelay/profile">
        <ProtectedRoute>
          <SocketRelayProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/socketrelay/announcements">
        <ProtectedRoute>
          <SocketRelayAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/socketrelay/chat/:id">
        <ProtectedRoute>
          <SocketRelayChat />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/socketrelay/admin">
        <ProtectedRoute>
          <SocketRelayAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/socketrelay/admin/announcements">
        <ProtectedRoute>
          <SocketRelayAdminAnnouncements />
        </ProtectedRoute>
      </Route>

      {/* Directory routes */}
      <Route path="/apps/directory">
        <ProtectedRoute>
          <DirectoryDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/directory/profile">
        <ProtectedRoute>
          <DirectoryProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/directory/announcements">
        <ProtectedRoute>
          <DirectoryAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/directory/admin">
        <ProtectedRoute>
          <DirectoryAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/directory/admin/announcements">
        <ProtectedRoute>
          <DirectoryAdminAnnouncements />
        </ProtectedRoute>
      </Route>

      {/* TrustTransport routes */}
      <Route path="/apps/trusttransport">
        <ProtectedRoute>
          <TrustTransportDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/profile">
        <ProtectedRoute>
          <TrustTransportProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/browse">
        <ProtectedRoute>
          <TrustTransportBrowse />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/request/new">
        <ProtectedRoute>
          <TrustTransportRequestNew />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/request/:id">
        <ProtectedRoute>
          <TrustTransportRequestDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/my-requests">
        <ProtectedRoute>
          <TrustTransportMyRequests />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/my-claimed">
        <ProtectedRoute>
          <TrustTransportMyClaimed />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/announcements">
        <ProtectedRoute>
          <TrustTransportAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/admin">
        <ProtectedRoute>
          <TrustTransportAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/trusttransport/admin/announcements">
        <ProtectedRoute>
          <TrustTransportAdminAnnouncements />
        </ProtectedRoute>
      </Route>

      {/* GentlePulse routes */}
      <Route path="/apps/gentlepulse">
        <ProtectedRoute>
          <>
            <GentlePulseLibrary />
          </>
        </ProtectedRoute>
      </Route>
      <Route path="/apps/gentlepulse/support">
        <ProtectedRoute>
          <>
            <GentlePulseSupport />
          </>
        </ProtectedRoute>
      </Route>
      <Route path="/apps/gentlepulse/settings">
        <ProtectedRoute>
          <>
            <GentlePulseSettings />
          </>
        </ProtectedRoute>
      </Route>
      <Route path="/apps/gentlepulse/admin">
        <ProtectedRoute>
          <GentlePulseAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/gentlepulse/admin/announcements">
        <ProtectedRoute>
          <GentlePulseAdminAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/gentlepulse/announcements">
        <ProtectedRoute>
          <>
            <GentlePulseAnnouncements />
          </>
        </ProtectedRoute>
      </Route>

      {/* Mood routes */}
      <Route path="/apps/mood">
        <ProtectedRoute>
          <MoodPage />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/mood/admin">
        <ProtectedRoute>
          <MoodAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/mood/admin/announcements">
        <ProtectedRoute>
          <MoodAdminAnnouncements />
        </ProtectedRoute>
      </Route>

      {/* Chyme routes */}
      <Route path="/apps/chyme">
        <ProtectedRoute>
          <ChymeDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/chyme/admin">
        <ProtectedRoute>
          <ChymeAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/chyme/admin/announcements">
        <ProtectedRoute>
          <ChymeAdminAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/chyme/announcements">
        <ProtectedRoute>
          <ChymeAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/chyme/room/:roomId">
        <ChymeRoomRoute>
          <ChymeRoomDetail />
        </ChymeRoomRoute>
      </Route>

      {/* Workforce Recruiter routes */}
      <Route path="/apps/workforce-recruiter">
        <ProtectedRoute>
          <WorkforceRecruiterDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/profile">
        <ProtectedRoute>
          <WorkforceRecruiterProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/occupations">
        <ProtectedRoute>
          <WorkforceRecruiterOccupations />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/occupations/:id">
        <ProtectedRoute>
          <WorkforceRecruiterOccupationDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/reports">
        <ProtectedRoute>
          <WorkforceRecruiterReports />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/skill-level/:skillLevel">
        <ProtectedRoute>
          <WorkforceRecruiterSkillLevelDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/announcements">
        <ProtectedRoute>
          <WorkforceRecruiterAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/admin">
        <ProtectedRoute>
          <WorkforceRecruiterAdmin />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/admin/announcements">
        <ProtectedRoute>
          <WorkforceRecruiterAdminAnnouncements />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/config">
        <ProtectedRoute>
          <WorkforceRecruiterConfig />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/workforce-recruiter/admin/occupations">
        <ProtectedRoute>
          <WorkforceRecruiterAdminOccupations />
        </ProtectedRoute>
      </Route>

      {/* Default Alive or Dead routes */}
      <Route path="/apps/default-alive-or-dead">
        <ProtectedRoute>
          <DefaultAliveOrDeadDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/apps/default-alive-or-dead/admin">
        <ProtectedRoute>
          <DefaultAliveOrDeadAdmin />
        </ProtectedRoute>
      </Route>
    </>
  );
}

export function registerMiniAppRoutes() {
  return <MiniAppRoutes />;
}


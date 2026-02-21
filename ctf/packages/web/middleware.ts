import type { NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const scannerPathPattern =
  /(wp-admin|wp-login|xmlrpc\.php|phpmyadmin|\.env|\.git|cgi-bin|boaform|hnap1|vendor\/phpunit|\.aws|id_rsa|autodiscover|\.svn|\.DS_Store|\.php$|\.asp$|\.aspx$)/i;

const scannerUserAgentPattern =
  /(python-requests|curl|wget|sqlmap|nikto|nmap|masscan|zgrab|go-http-client|scrapy|crawler|scanner|bot)/i;

const scannerProtectionMiddleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") ?? "";

  if (scannerPathPattern.test(pathname) || scannerUserAgentPattern.test(userAgent)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
};

export default clerkMiddleware((auth, request) => {
  return scannerProtectionMiddleware(request);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

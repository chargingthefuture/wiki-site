import type { NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveClerkRuntimeConfig } from "./src/lib/server/clerkHostConfig";

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

const clerkHostMiddleware = (request: NextRequest) => {
  let clerkConfig;

  try {
    clerkConfig = resolveClerkRuntimeConfig(request.headers);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Clerk host mapping error";
    return new NextResponse(message, { status: 500 });
  }

  const middleware = clerkMiddleware(
    (_auth, innerRequest) => scannerProtectionMiddleware(innerRequest),
    {
      secretKey: clerkConfig.secretKey,
      publishableKey: clerkConfig.publishableKey,
    },
  );

  return middleware(request);
};

export default clerkHostMiddleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

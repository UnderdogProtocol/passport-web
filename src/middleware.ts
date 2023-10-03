import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const pagesNextAuthOptions = {
  signIn: "/signin",
};

// Custom middleware
export function middleware(req: NextRequest) {

  // Checking `/api` routes
  if (req.nextUrl.pathname.startsWith("/api")) {

    const authHeader = req.headers.get("authorization");

    if (!authHeader ||
      !authHeader.startsWith("Bearer ") ||
      authHeader.split(" ")[1] !== process.env.SPHERE_SIGNING_SECRET
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next();
  }

}

export default withAuth({
  pages: pagesNextAuthOptions,
  secret: process.env.NEXTAUTH_SECRET,
});

// Matcher to match all pages except for the ones starting with and middlewares to apply
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  middleware: [middleware]
}
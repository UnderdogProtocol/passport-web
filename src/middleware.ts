import { withAuth } from "next-auth/middleware";

export const pagesNextAuthOptions = {
  signIn: "/signin",
};

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
     */
    '/((?!api).*)', // might need to make this `/api/sphere`
  ],
}
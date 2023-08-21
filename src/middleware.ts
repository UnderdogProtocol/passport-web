import { withAuth } from "next-auth/middleware";

export const pagesNextAuthOptions = {
  signIn: "/signin",
};

export default withAuth({
  pages: pagesNextAuthOptions,
  secret: process.env.NEXTAUTH_SECRET,
});

import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

import GoogleProvider from "next-auth/providers/google";

export const pagesNextAuthOptions: NextAuthOptions["pages"] = {
  signIn: "/signin",
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile: ({ data }) => ({
        id: data.id,
        name: `@${data.username.toLowerCase()}`,
        email: `@${data.username.toLowerCase()}`,
        image: data.profile_image_url,
      }),
    }),
  ],
  pages: pagesNextAuthOptions,
};

export default NextAuth(authOptions);

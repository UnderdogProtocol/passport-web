import NextAuth, { NextAuthOptions } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import Google from "next-auth/providers/google";
import Reddit from "next-auth/providers/reddit";
import Credentials from "next-auth/providers/credentials";
import { base58 } from "@metaplex-foundation/umi/serializers";
import nacl from "tweetnacl";
import { NextApiRequest, NextApiResponse } from "next";

export const pagesNextAuthOptions: NextAuthOptions["pages"] = {
  signIn: "/signin",
};

export const nextAuthOptions = (req: NextApiRequest): NextAuthOptions => ({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Twitter({
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
    Reddit({
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      authorization: {
        params: {
          duration: "permanent",
          scope: "identity mysubreddits flair",
        },
      },
      profile: (profile) => ({
        id: profile.id,
        name: `u/${profile.name.toLowerCase()}`,
        email: `u/${profile.name.toLowerCase()}`,
      }),
    }),
    Credentials({
      credentials: {
        walletAddress: { label: "Wallet Address" },
        signature: { label: "Signature" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

        const nonce = req.cookies["passport-nonce"];

        const message = `Sign this message to connect your wallet.\n\nNonce: ${nonce}`;
        const messageBytes = new TextEncoder().encode(message);

        const result = nacl.sign.detached.verify(
          messageBytes,
          base58.serialize(credentials.signature),
          base58.serialize(credentials.walletAddress),
        );

        if (!result) throw new Error("Unable to verify signature");

        return {
          id: credentials.walletAddress,
          name: credentials.walletAddress,
          email: credentials.walletAddress,
        };
      },
    }),
  ],
  pages: pagesNextAuthOptions,
});

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, nextAuthOptions(req));

export default handler;

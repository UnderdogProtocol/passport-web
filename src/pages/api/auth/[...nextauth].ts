import { faker } from "@faker-js/faker";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const context = createUmi(
  "https://rpc.helius.xyz/?api-key=f961a77f-7072-4316-b9a2-1cab32a4d4a1"
);

export const pagesNextAuthOptions: NextAuthOptions["pages"] = {
  signIn: "/signin",
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: pagesNextAuthOptions,
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const linkPda = findLinkPda(context, { identifier: user.email })[0];

        const response = await axios.get(
          `https://api.underdogprotocol.com/v2/projects/4/nfts?ownerAddress=${linkPda}&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}}`,
            },
          }
        );
        if (response.data.results.length === 0) {
          await axios.post(
            `https://api.underdogprotocol.com/v2/projects/4/nfts`,
            {
              name: `Underdog ID #${faker.datatype.number({
                min: 0,
                max: 10000,
              })}`,
              symbol: "UDID",
              image:
                "https://updg8.com/imgdata/8QfUaoNPNwjEAKHkXvBUrjQaqiRf7MmpRWUHuQdMZyXj",
              attributes: {
                points: faker.datatype.number({ min: 0, max: 69 }),
              },
              externalUrl: "https://id.underdogprotocol.com",
              receiverAddress: linkPda,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}}`,
              },
            }
          );
        }
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);

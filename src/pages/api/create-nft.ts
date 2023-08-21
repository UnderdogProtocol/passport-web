import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { findLinkPda } from "@underdog-protocol/underdog-identity-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";
import { authOptions } from "./auth/[...nextauth]";
import { faker } from "@faker-js/faker";
import axios from "axios";

const router = createRouter<NextApiRequest, NextApiResponse>();

const context = createUmi(
  "https://rpc.helius.xyz/?api-key=f961a77f-7072-4316-b9a2-1cab32a4d4a1"
);

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) return res.status(401).end();

  const linkPda = findLinkPda(context, { identifier: session.user.email })[0];

  const name = faker.lorem.words(2).slice(0, 31);
  const symbol = name.slice(0, 5).toUpperCase().replaceAll(" ", "");

  await axios.post(
    "https://api.underdogprotocol.com/v2/projects/1/nfts",
    {
      name,
      symbol,
      image: "https://picsum.photos/200",
      receiverAddress: linkPda,
    },
    { headers: { Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}` } }
  );

  res.status(202).send({ message: "OK" });
});

export default router.handler();

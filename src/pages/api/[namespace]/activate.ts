import { context } from "@/lib/context";
import {
  createNoopSigner,
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

import { toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { initializeLinkV0 } from "@underdog-protocol/underdog-identity-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";
import * as HttpStatus from "http-status";
import { authOptions } from "../auth/[...nextauth]";

const router = createRouter<NextApiRequest, NextApiResponse>();

context.use(
  keypairIdentity(
    createSignerFromKeypair(context, {
      publicKey: publicKey("a5sSqWJR1WExtq1hvufeep8fLU43xxXXac44k6FRgbs"),
      secretKey: base58.serialize(process.env.ADMIN_SECRET_KEY!),
    }),
  ),
);

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "You must be logged in." });
  }

  if (!(session.user?.email && req.body.linkerAddress)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "Identifier & address are required" });
  }

  const transaction = toWeb3JsTransaction(
    await initializeLinkV0(context, {
      linker: createNoopSigner(publicKey(req.body.linkerAddress)),
      namespace: req.query.namespace as string,
      identifier: session.user.email,
    }).buildAndSign(context),
  );

  res.send(base58.deserialize(transaction.serialize())[0]);
});

export default router.handler();

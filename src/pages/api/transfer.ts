import { helius } from "@/lib/helius";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { transferAssetV0 } from "@underdog-protocol/underdog-identity-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";
import { authOptions } from "./auth/[...nextauth]";
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
  publicKeyBytes,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { DAS } from "helius-sdk";

const router = createRouter<NextApiRequest, NextApiResponse>();

const context = createUmi(
  "https://rpc.helius.xyz/?api-key=f961a77f-7072-4316-b9a2-1cab32a4d4a1"
);

context.use(
  keypairIdentity(
    createSignerFromKeypair(context, {
      publicKey: publicKey("a5sSqWJR1WExtq1hvufeep8fLU43xxXXac44k6FRgbs"),
      secretKey: base58.serialize(process.env.ADMIN_SECRET_KEY!),
    })
  )
);

console.group(context.identity.publicKey);

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const { mintAddress } = req.body;

  if (!session?.user?.email)
    return res.status(403).send({ error: "Unauthorized" });

  const asset = (await helius.rpc.getAsset(
    mintAddress
  )) as DAS.GetAssetResponse;
  const assetProof = await helius.rpc.getAssetProof({ id: mintAddress });

  try {
    await transferAssetV0(context, {
      receiverAddress: publicKey(
        "949ayENThx9oNq12tCTKBfzXrCNGC3pyFZWjQNFPdVz4"
      ),
      merkleTree: publicKey(asset.compression?.tree!),
      root: publicKeyBytes(assetProof.root),
      dataHash: publicKeyBytes(asset.compression?.data_hash!),
      creatorHash: publicKeyBytes(asset.compression?.creator_hash!),
      leafIndex: asset.compression?.leaf_id!,
      identifier: session.user.email,
    }).sendAndConfirm(context);
  } catch (e) {
    console.log(e);
  }
  console.log(assetProof);
  console.log(asset);

  res.status(202).send({ message: "Accepted" });

  // helius.rpc.getAssetProof();

  // transferAssetV0(context, {
  //   receiverAddress: undefined,
  //   merkleTree: undefined,
  //   root: undefined,
  //   dataHash: undefined,
  //   creatorHash: undefined,
  //   leafIndex: 0,
  //   identifier: session?.user?.email,
  // });
});

export default router.handler();

import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import * as HttpStatus from "http-status";
import { searchAssets } from "@/lib/helius";
import { getPassportAddress } from "@underdog-protocol/passport";
import { AssetSortBy, AssetSortDirection } from "helius-sdk";
import { authOptions } from "../auth/[...nextauth]";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "You must be logged in." });
  }

  const { page = 1, limit = 100 } = req.query;

  const assets = await searchAssets({
    ownerAddress: getPassportAddress({
      namespace: "mail",
      identifier: session.user!.email!,
    }),
    grouping: ["collection", process.env.MAIL_UNDERDOG_PROJECT_MINT] as any,
    page: Number.parseInt(page.toString(), 10),
    limit: Number.parseInt(limit.toString(), 10),
    sortBy: {
      sortBy: AssetSortBy.Created,
      sortDirection: AssetSortDirection.Desc,
    },
  });

  return res.status(HttpStatus.OK).json(assets);
});

export default router.handler();

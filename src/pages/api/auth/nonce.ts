import { serialize } from "cookie";

import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const nonce = crypto.randomBytes(32).toString("base64");

  res.setHeader(
    "Set-Cookie",
    serialize("passport-nonce", nonce, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    }),
  );

  res.status(200).json({ nonce });
});

export default router.handler();

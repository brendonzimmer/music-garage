import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";

// Route Handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return get(req, res);

  return res.status(400).send(`Cannot ${req.method} /api/user`);
};

// GET ———————————————————————————————————————————————————————————————————————
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_MOVING_CLIENT_ID,
        scope: "user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative",
        redirect_uri: process.env.REDIRECT,
      })
  );
};

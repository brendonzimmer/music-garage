import jwt from "jsonwebtoken";
import fs from "fs";

// Generate token for Apple Music
const private_key = fs.readFileSync("apple_private_key.p8").toString();
const team_id = process.env.AM_TEAM_ID;
const key_id = process.env.AM_KEY_ID;

export function createJWT() {
  const token = jwt.sign({}, private_key, {
    algorithm: "ES256",
    expiresIn: "180d",
    issuer: team_id,
    header: { alg: "ES256", kid: key_id },
  });

  return token;
}

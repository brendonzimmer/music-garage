import { GetServerSidePropsContext, NextApiResponse } from "next";
import { tokenData } from "./spotifyServices";
import moment from "moment";

function getExpiration(expiresIn: moment.DurationInputArg1, timeUnit: moment.unitOfTime.DurationConstructor) {
  return moment().add(expiresIn, timeUnit).toDate();
}

export const setCookie = (res: AnyNextResponse, token: tokenData["access_token"]) => {
  res.setHeader(
    "Set-Cookie",
    `refresh=${token}; Path=/; HttpOnly; Secure; Expires=${getExpiration(3, "d")}; SameSite=Strict`
  );
};

export type AnyNextResponse = NextApiResponse | GetServerSidePropsContext["res"];

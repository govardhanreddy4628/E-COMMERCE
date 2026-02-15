import { CookieOptions } from "express";

export function getAuthCookieOptions(req: any): CookieOptions {
  const isLocalhost =
    req.hostname === "localhost" ||
    req.hostname === "127.0.0.1";

  return {
    httpOnly: true,
    secure: !isLocalhost,               // ❗ HTTPS only in prod
    sameSite: isLocalhost ? "lax" : "none",
    path: "/",
  };
}
//the above code needs changes after deployment of backend and frontend on production server with https. so keep it in mind.




// import { CookieOptions } from "express";
// const cookieOptionsBase: CookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
//     | "none"
//     | "lax"
//     | "strict",
//   path: "/",
// };
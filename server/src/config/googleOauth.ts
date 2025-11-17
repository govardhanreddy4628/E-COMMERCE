import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

export const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI, // e.g. http://localhost:8080/api/v1/auth/google/callback
});

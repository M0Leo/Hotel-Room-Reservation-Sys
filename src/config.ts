import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET,
  sessionCookieMaxAge: process.env.SESSION_COOKIE_MAX_AGE,
  admin: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};

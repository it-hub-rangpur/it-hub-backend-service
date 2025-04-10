import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envConfig = {
  node_environment: process.env.NODE_ENV as string,
  db_uri: process.env.DB_URI as string,
  port: process.env.PORT as unknown as number,
  websiteURL: process.env.WEBSITE_URL as string,
  reCaptchaEndpoint: process.env.RECAPTCHAENDPOINT as string,
  recaptchaKey: process.env.RECAPTCHAKEY as string,
  antiCaptchaKey: process.env.ANTYKEY as string,
  nopeCaptchaKey: process.env.NOPECHAAPIKEY as string,
  websiteKey: process.env.WEBSITEKEY as string,
  secretKey: process.env.SECTECT_TOKEN_KEY as string,
};

export default envConfig;

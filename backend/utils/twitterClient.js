/*global process*/
import { TwitterApi } from "twitter-api-v2";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.argv.length > 2) {
  // Development enviroment variables
  dotenv.config({ path: join(__dirname, "..", ".env.development.tokens") });
}
// Production enviroment variables
else {
  dotenv.config({ path: join(__dirname, "..", ".env.production.tokens") });
}

const userClient = new TwitterApi({
  appKey: process.env.apikey,
  appSecret: process.env.apikeysecret,
  accessToken: process.env.accesstoken,
  accessSecret: process.env.accesstokensecret,
});

const appClient = new TwitterApi(process.env.bearertoken);

/* per postare i tweet */
export const rwClient = userClient.readWrite;

/* per tutte le operazioni di ricerca e stream */
export const roClient = appClient.readOnly;

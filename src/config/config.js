import dotenv from "dotenv";

dotenv.config({path: ".env"});

export default {
  port: process.env.PORT,
  mongoURL : process.env.MONGO_URL,
  admin: process.env.ADMIN_NAME,
  passAdmin: process.env.ADMIN_PASSWORD,
  tokenPass: process.env.TOKEN_PASSWORD,
  environment: process.env.ENVIRONMENT
}
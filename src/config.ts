import { config } from "dotenv";

config();

export default {
    PORT : process.env.PORT,
    SECRET_JWT: process.env.SECRET_JWT,
}
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import auth from "./app/auth/route";

const app = new Hono().basePath("/api");

app.use("*", secureHeaders(), prettyJSON());

app.route("/auth", auth);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};

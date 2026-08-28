import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
/**
 * Origins are allowlisted rather than open. The counter route is a public write
 * endpoint, and while CORS cannot stop a determined caller (a simple POST is
 * sent whatever the response headers say), leaving it wide open would let any
 * page on the web read /api/stats through a browser the owner is signed in to.
 *
 * Unset means no cross-origin access at all, which is the safe default for a
 * server nobody has configured yet.
 */
const allowedOrigins = (process.env["COUNTER_ALLOWED_ORIGINS"] ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ["GET", "POST"],
    credentials: false,
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: "1kb" }));
// The counter posts text/plain so its request stays a CORS simple request and
// skips the preflight round trip; without this the body would arrive undefined.
app.use(express.text({ type: "text/plain", limit: "1kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;

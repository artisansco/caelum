import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { trimTrailingSlash } from "hono/trailing-slash";
import auth from "./routes/auth";
import schools from "./routes/schools";
import staff from "./routes/staff";
import students from "./routes/students";
import subjects from "./routes/subjects";

const app = new Hono();

app.use(trimTrailingSlash());
app.use(logger());
app.use(cors());
app.use(secureHeaders());
app.use("/uploads/*", serveStatic({ root: "./" }));
app.use(
	bodyLimit({
		maxSize: 1024 * 1024 * 5, // 5MB,
		onError: (c) => {
			return c.json({ status: "error", message: "Payload Too Large" }, 413);
		},
	}),
);

app.route("/api/v1", auth);
app.route("/api/v1", subjects);
app.route("/api/v1", staff);
app.route("/api/v1", students);
app.route("/api/v1", schools);

export default app;

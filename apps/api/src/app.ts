import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { trimTrailingSlash } from "hono/trailing-slash";
import auth from "./routes/auth";
import schools from "./routes/schools";
import staff from "./routes/staff";

// import users from "./routes/users";

const app = new Hono();

app.use(trimTrailingSlash());
app.use(logger());
app.use(cors());
app.use(secureHeaders());
app.use(
	bodyLimit({
		maxSize: 1024 * 1024 * 5, // 5MB,
		onError: (c) =>
			c.json({ status: "error", message: "Payload Too Large" }, 413),
	}),
);

app.route("/api/v1", auth);
// app.route("/api/v1", users);
app.route("/api/v1", staff);
app.route("/api/v1", schools);

export default app;

/*
  model Class {
   id          String    @id @unique @default(uuid())
   name        String    @unique
   dateCreated DateTime  @default(now())
   students    Student[]
   subjects    Subject[]

   @@index([name])
   @@map("classes")
 }

 model Subject {
   id          String   @id @unique @default(uuid())
   name        String   @unique
   subjectCode String   @unique
   dateCreated DateTime @default(now())
   lastUpdated DateTime @updatedAt
   classes     Class[]

   @@index([name, subjectCode])
   @@map("subjects")
 }

 model Student {
   id             String   @id @unique @default(uuid())
   name           String   @unique
   roll           String   @unique
   email          String?  @unique
   gender         String
   dateOfBirth    DateTime
   dateRegistered DateTime @default(now())
   lastUpdated    DateTime @updatedAt

   classId String?
   class   Class?  @relation(fields: [classId], references: [id])

   @@index([name, roll, email])
   @@map("students")
 }
 */

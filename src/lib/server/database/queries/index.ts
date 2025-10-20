import { db } from "../drizzle";
import * as announcements from "./announcements";
import * as assignments from "./assignments";
import * as classes from "./classes";
import * as grades from "./grades";
import * as payments from "./payments";
import * as schools from "./schools";
import * as staff from "./staff";
import * as students from "./students";
import * as subjects from "./subjects";
import * as transactions from "./transactions";

export const database = {
	db,
	...announcements,
	...assignments,
	...classes,
	...grades,
	...payments,
	...schools,
	...staff,
	...students,
	...subjects,
	...transactions,
};

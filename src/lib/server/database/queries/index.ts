import { db } from "../drizzle";
import * as announcements from "./announcements";
import * as assignments from "./assignments";
import * as attendance from "./attendance";
import * as audit from "./audit";
import * as classes from "./classes";
import * as grades from "./grades";
import * as guardians from "./guardians";
import * as notifications from "./notifications";
import * as payments from "./payments";
import * as schools from "./schools";
import * as staff from "./staff";
import * as students from "./students";
import * as subjects from "./subjects";
import * as submissions from "./submissions";
import * as timetable from "./timetable";
import * as transactions from "./transactions";

export const database = {
	db,
	...announcements,
	...assignments,
	...attendance,
	...audit,
	...classes,
	...grades,
	...guardians,
	...notifications,
	...payments,
	...schools,
	...staff,
	...students,
	...subjects,
	...submissions,
	...timetable,
	...transactions,
};

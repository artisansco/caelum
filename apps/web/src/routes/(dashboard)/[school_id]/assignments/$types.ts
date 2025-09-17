import type { ActionData, PageLoad } from "./$types.js";

export interface Assignment {
	id: number;
	title: string;
	description?: string;
	className: string;
	classId: number;
	dueDate: string;
	uploadedDate: string;
	fileName: string;
	filePath: string;
	fileSize: number;
	uploadedBy: string;
	schoolId: number;
}

export interface Class {
	id: number;
	name: string;
	section?: string;
	schoolId: number;
	createdAt: string;
	updatedAt: string;
}

export interface AssignmentFormData {
	title: string;
	description?: string;
	classId: string;
	dueDate?: string;
	file: File;
}

export interface PageData {
	assignments: Assignment[];
	classes: Promise<Class[]>;
	schoolId: string;
}

export interface ActionData {
	success?: boolean;
	message?: string;
	error?: string;
	assignment?: Assignment;
}

export type PageProps = {
	data: PageData;
	form?: ActionData;
};

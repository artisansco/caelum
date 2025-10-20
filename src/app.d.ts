import type { CurrentUser } from "./lib/types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			school_id: string;
			user?: CurrentUser;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

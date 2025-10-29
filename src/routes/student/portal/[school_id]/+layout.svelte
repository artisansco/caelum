<script lang="ts">
	import { page } from "$app/stores";
	import { createForm } from "@modular-forms/svelte-remote";
	import { logout } from "../../auth.remote";

	const { data } = $props();
	const [logoutForm, { Form }] = createForm(logout);
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Top Navigation -->
	<nav class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-bold text-gray-900">
						{data.school?.name || "Student Portal"}
					</h1>
				</div>

				<div class="flex items-center space-x-4">
					<div class="text-sm text-gray-700">
						<p class="font-medium">{data.student.first_name} {data.student.last_name}</p>
						<p class="text-xs text-gray-500">{data.student.admission_number}</p>
					</div>

					<Form>
						<button
							type="submit"
							class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Logout
						</button>
					</Form>
				</div>
			</div>
		</div>
	</nav>

	<!-- Content Area -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Navigation Tabs -->
		<div class="mb-6">
			<div class="border-b border-gray-200">
				<nav class="-mb-px flex space-x-8">
					<a
						href="/student/portal/{$page.params.school_id}"
						class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
							{$page.url.pathname === `/student/portal/${$page.params.school_id}` ? 'border-indigo-500 text-indigo-600' : ''}"
					>
						My Results
					</a>

					<a
						href="/student/portal/{$page.params.school_id}/attendance"
						class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
							{$page.url.pathname.includes('/attendance') ? 'border-indigo-500 text-indigo-600' : ''}"
					>
						Attendance
					</a>

					<a
						href="/student/portal/{$page.params.school_id}/assignments"
						class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
							{$page.url.pathname.includes('/assignments') ? 'border-indigo-500 text-indigo-600' : ''}"
					>
						Assignments
					</a>
				</nav>
			</div>
		</div>

		{@render children()}
	</main>
</div>

<script lang="ts">
	import { createForm } from "@modular-forms/svelte-remote";
	import { login } from "../auth.remote";

	const [form, { Form, Field }] = createForm(login);
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
				Student Portal Login
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Enter your admission number and password to access your results
			</p>
		</div>

		<Form class="mt-8 space-y-6">
			<div class="space-y-4">
				<Field name="admission_number">
					{#snippet children(field, props)}
						<div>
							<label for="admission_number" class="block text-sm font-medium text-gray-700">
								Admission Number
							</label>
							<input
								{...props}
								type="text"
								id="admission_number"
								value={field.value}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="Enter your admission number"
								autocomplete="username"
								required
							/>
							{#if field.error}
								<p class="mt-1 text-sm text-red-600">{field.error}</p>
							{/if}
						</div>
					{/snippet}
				</Field>

				<Field name="password">
					{#snippet children(field, props)}
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								{...props}
								type="password"
								id="password"
								value={field.value}
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								placeholder="Enter your password"
								autocomplete="current-password"
								required
							/>
							{#if field.error}
								<p class="mt-1 text-sm text-red-600">{field.error}</p>
							{/if}
						</div>
					{/snippet}
				</Field>
			</div>

			{#if $form.response?.message}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">
								{$form.response.message}
							</h3>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={$form.submitting}
					class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if $form.submitting}
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</div>

			<div class="text-center">
				<p class="text-sm text-gray-600">
					Don't have a password yet?
					<span class="text-indigo-600">Contact your school administrator</span>
				</p>
			</div>

			<div class="text-center mt-4">
				<a href="/" class="text-sm text-indigo-600 hover:text-indigo-500">
					← Back to main site
				</a>
			</div>
		</Form>
	</div>
</div>

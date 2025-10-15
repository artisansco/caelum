<script lang="ts">
	import Dialog from '$lib/components/dialog.svelte';
	import { dialog_state } from '$lib/dialog-state.svelte';
	import { add_subject, get_subjects, delete_subject } from './subjects.remote';
	import { toast } from 'svelte-sonner';

	const { params } = $props();
	const { code, name, notes } = add_subject.fields;

	let subs_promise = $derived(get_subjects());
	let subjects = $derived(await subs_promise);
	let selected_subject: (typeof subjects)[number] | null = $state(null);

	$effect(() => {
		if (add_subject.result?.message) {
			toast.success(add_subject.result.message);
		}
	});
</script>

<section class="max-w-7xl mx-auto p-6">
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Subjects</h1>
				<p class="text-gray-600">Manage your school's academic subjects</p>
			</div>

			<Dialog label="Add New Subject" btn_txt="New Subject" icon="icon-[mdi--plus]">
				<form
					{...add_subject.enhance(async ({ submit }) => {
						await submit();
						dialog_state.open = false;
					})}
					oninput={() => add_subject.validate()}
					class="space-y-4"
				>
					<input type="hidden" name="school_id" value={params.school_id} />

					<div>
						<label for="subject-name" class="block text-sm font-medium text-gray-700 mb-2">
							Subject Name <span class="text-red-500">*</span>
						</label>
						<input
							{...name.as('text')}
							type="text"
							placeholder="e.g., Mathematics, English Language, Biology"
							class="input"
						/>
						<p class="text-xs text-gray-500 mt-1">Enter the full name of the subject</p>
					</div>

					<div>
						<label for="subject-code" class="block text-sm font-medium text-gray-700 mb-2">
							Subject Code
						</label>
						<input
							{...code.as('text')}
							type="text"
							placeholder="e.g., MATH-001, ENG-101, BIO-201"
							class="input"
						/>
						<p class="text-xs text-gray-500 mt-1">Optional: Enter a unique code for the subject</p>
					</div>

					<div>
						<label for="subject-code" class="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							{...notes.as('text')}
							placeholder="e.g., Mathematics, English Language, Biology"
							class="textarea"
						></textarea>
						<p class="text-xs text-gray-500 mt-1">Optional: Enter a unique code for the subject</p>
					</div>

					<div class="flex justify-end gap-3 pt-4">
						<button type="submit" class="btn" disabled={add_subject.pending > 0}>
							{#if add_subject.pending > 0}
								<i class="icon-[mdi--loading] animate-spin"></i>
								Creating...
							{:else}
								<i class="icon-[mdi--plus]"></i>
								Create Subject
							{/if}
						</button>
					</div>
				</form>
			</Dialog>
		</div>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Subjects Table -->
		<section class="lg:col-span-1 bg-white rounded-lg border shadow-sm h-fit">
			<header class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">All Subjects ({subjects.length})</h2>
			</header>

			<div class="max-h-[65dvh] overflow-y-scroll divide-y divide-gray-200">
				{#each subjects as subject}
					<button
						type="button"
						class="w-full text-left px-6 py-4 hover:bg-gray-50 {selected_subject?.id === subject.id
							? 'bg-blue-50 border-r border-blue-300'
							: ''}"
						onclick={() => (selected_subject = subject)}
					>
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-medium text-gray-900">{subject.name}</h3>
								<p class="text-sm text-gray-500">
									{subject.code ? `Code: ${subject.code}` : 'No code assigned'}
								</p>
							</div>
							<i class="icon-[mdi--chevron-right] size-5 text-gray-400"></i>
						</div>
					</button>
				{:else}
					<div class="p-12 text-center">
						<div class="flex flex-col items-center">
							<i class="icon-[mdi--book-open-variant] text-gray-300 size-12 mb-4"></i>
							<h3 class="text-sm font-medium text-gray-900 mb-2">No Subjects</h3>
							<p class="text-sm text-gray-500">Get started by creating your first subject.</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Subject Details -->
		<section class="lg:col-span-2">
			{#if selected_subject}
				<article class="bg-white rounded-lg border shadow-sm">
					<header class="px-6 py-4 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<h2 class="text-xl font-semibold text-gray-900">{selected_subject.name}</h2>

							<Dialog
								label="Delete Class"
								icon="icon-[mdi--trash]"
								trigger_class="btn-sm-destructive"
							>
								<div class="space-y-4">
									<p>
										Are you sure you want to delete "{selected_subject.name}"? This action cannot be
										undone.
									</p>
									<button
										type="button"
										class="btn-sm-destructive"
										onclick={async () => {
											await delete_subject(String(selected_subject?.id));
											dialog_state.open = false;
											selected_subject = null;
											toast.success('Subject deleted successfully');
										}}
									>
										<i class="icon-[mdi--trash]"></i>
										Delete Subject
									</button>
								</div>
							</Dialog>
						</div>
					</header>

					<div class="p-6">
						<dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Subject Name</dt>
								<dd class="mt-1 text-sm text-gray-900">{selected_subject.name}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Subject Code</dt>
								<dd class="mt-1 text-sm font-mono text-gray-900">
									{selected_subject.code || 'Not assigned'}
								</dd>
							</div>
						</dl>

						<div class="mt-8">
							<h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
							<div class="bg-gray-50 rounded-lg p-4">
								<p class="text-sm text-gray-600 italic">
									No description available for this subject. Consider adding one to help teachers
									and students understand the subject scope.
								</p>
							</div>
						</div>
					</div>
				</article>
			{:else}
				<div class="bg-white rounded-lg border shadow-sm p-12 text-center">
					<div class="flex flex-col items-center">
						<i class="icon-[mdi--book-open-variant] text-gray-300 size-16 mb-4"></i>
						<h3 class="text-lg font-medium text-gray-900 mb-2">Select a Subject</h3>
						<p class="text-gray-500">Choose a subject from the list to view its details</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</section>

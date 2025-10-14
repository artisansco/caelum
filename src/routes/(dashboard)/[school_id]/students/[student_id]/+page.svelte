<script lang="ts">
	import { Avatar, Select } from 'melt/components';
	import { format } from '@formkit/tempo';
	import { get_status_pill } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import Dialog from '$lib/components/dialog.svelte';
	import { delete_student, get_student, update_student } from '../students.remote';
	import { student_statuses } from '$lib/constants';

	const { params } = $props();
	const { address, email, first_name, last_name, middle_name, phone_number } =
		update_student.fields;

	let student_promise = $derived(get_student(params.student_id));
	let student = $derived(await student_promise);
	let status = $derived(student.status);
	let edit_mode = $state(false);
	let toggle_dialog = $state(false);

	$effect(() => {
		if (update_student.result?.message) {
			toast.info(update_student.result.message);
		}
	});

	// $inspect(student);
</script>

<div class="max-w-7xl px-6 py-8">
	<!-- Header Section -->
	<header class="mb-8">
		<nav class="mb-4">
			<a href="./" class="btn-sm-ghost">
				<i class="icon-[mdi--arrow-left]"></i>
				Back to Students
			</a>
		</nav>

		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Avatar src={String(student.avatar_url)}>
					{#snippet children(avatar)}
						<img
							{...avatar.image}
							alt={student.first_name}
							class="size-20 rounded-full object-cover border"
						/>
						<span
							{...avatar.fallback}
							class="size-20 rounded-full text-gray-500 grid place-content-center border"
						>
							{student.first_name?.at(0)}{student.last_name?.at(0)}
						</span>
					{/snippet}
				</Avatar>

				<div>
					<h1 class="text-2xl font-bold text-gray-900">
						{student.first_name}
						{student.middle_name}
						{student.last_name}
					</h1>
					<div class="mt-1 flex items-center gap-4">
						<p class="text-gray-600 capitalize">
							{format({
								date: student.admission_date,
								format: 'MMM DD, YYYY'
							})}:
						</p>
						<p class="btn-sm-ghost">
							<i class="icon-[mdi--tag] size-4"></i>
							{student.admission_number}
						</p>
						<span class={get_status_pill(student.status || 'enrolled')}>
							{student.status || 'enrolled'}
						</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-3">
				{#if edit_mode}
					{#if update_student.pending === 0}
						<button
							type="button"
							onclick={() => (edit_mode = !edit_mode)}
							class="btn-sm-destructive"
						>
							<i class="icon-[mdi--close]"></i>
							Cancel
						</button>
					{/if}
					<button
						type="submit"
						form="edit_details"
						disabled={update_student.pending > 0}
						class="btn-sm"
					>
						{#if update_student.pending > 0}
							<i class="icon-[mdi--loading] animate-spin"></i>
							Saving...
						{:else}
							<i class="icon-[mdi--check]"></i>
							Save Changes
						{/if}
					</button>
				{:else}
					<button type="button" onclick={() => (edit_mode = !edit_mode)} class="btn-sm">
						<i class="icon-[mdi--pencil]"></i>
						Edit
					</button>
					<Dialog
						label="Delete Student?"
						btn_txt="Delete"
						icon="icon-[mdi--trash]"
						trigger_class="btn-sm-destructive"
						{toggle_dialog}
					>
						<p class="mb-5 mt-2 leading-normal text-zinc-600">
							This action cannot be undone. This will permanently delete the student and remove it
							from our servers.
						</p>
						<button
							type="button"
							class="btn-destructive w-full"
							onclick={async () => {
								await delete_student(student.id);
								toast.success('Student deleted successfully');
								window.location.href = './';
							}}
						>
							<i class="icon-[mdi--trash]"></i>
							Confirm Delete
						</button>
					</Dialog>
				{/if}
			</div>
		</div>
	</header>

	<form
		id="edit_details"
		{...update_student.enhance(async ({ submit }) => {
			await submit();
			toast.success('Student updated successfully');
			edit_mode = false;
		})}
		oninput={() => update_student.validate()}
	>
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column - Main Information -->
			<section class="lg:col-span-2">
				<div class="space-y-6">
					<!-- Personal Information -->
					<article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<header class="mb-6 flex items-center gap-3">
							<i class="icon-[mdi--account] size-6 bg-blue-500"></i>
							<h2 class="text-lg font-bold text-gray-700">Personal Information</h2>
						</header>

						<input type="hidden" name="status" bind:value={status} />
						<input type="hidden" name="student_id" value={params.student_id} />
						<input type="hidden" name="school_id" value={params.school_id} />

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="flex flex-col space-y-2">
								<label for="first_name" class="label text-sm text-gray-500"> First Name </label>
								<input
									{...first_name.as('text')}
									type="text"
									value={student.first_name}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div class="flex flex-col space-y-2">
								<label for="middle_name" class="label text-sm text-gray-500"> Middle Name </label>
								<input
									{...middle_name.as('text')}
									type="text"
									value={student.middle_name || ''}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div class="flex flex-col space-y-2">
								<label for="last_name" class="label text-sm text-gray-500"> Last Name </label>
								<input
									{...last_name.as('text')}
									type="text"
									value={student.last_name}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div class="flex flex-col space-y-2">
								<label for="email" class="label text-sm text-gray-500"> Email </label>
								<input
									{...email.as('email')}
									type="email"
									value={student.email || ''}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div class="flex flex-col space-y-2">
								<label for="phone_number" class="label text-sm text-gray-700"> Phone Number </label>
								<input
									{...phone_number.as('tel')}
									type="tel"
									value={student.phone_number || ''}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div class="flex flex-col space-y-2">
								<label for="address" class="label text-sm text-gray-500"> Address </label>
								<input
									{...address.as('text')}
									type="text"
									value={student.address || ''}
									disabled={!edit_mode}
									class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
								/>
							</div>

							<div>
								<Select bind:value={status}>
									{#snippet children(select)}
										<label for={select.ids.trigger} class="label mb-2 text-sm text-gray-500">
											Status
										</label>
										<button
											{...select.trigger}
											disabled={!edit_mode}
											class="btn-outline capitalize {edit_mode
												? 'w-full justify-between'
												: 'border-0 px-0 font-bold'}"
										>
											{select.value || 'Select status'}
											{#if edit_mode}
												<i class="icon-[lucide--chevron-down]"></i>
											{/if}
										</button>

										<div
											{...select.content}
											class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
										>
											{#each student_statuses as status}
												<p
													{...select.getOption(status, status)}
													class="{status === select.value &&
														'bg-gray-100'} p-2 hover:bg-gray-100 capitalize"
												>
													{status}
												</p>
											{/each}
										</div>
									{/snippet}
								</Select>
							</div>
						</div>
					</article>

					<!-- Right Column - Additional Information -->
					<aside class="space-y-6">
						<!-- Additional Notes -->
						<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
							<header class="mb-6 flex items-center gap-3">
								<i class="icon-[mdi--note-text] size-6 text-gray-600"></i>
								<h3 class="text-lg font-bold text-gray-900">Additional Notes</h3>
							</header>

							<textarea
								class="textarea cursor-text resize-none border-0 p-0"
								readonly
								disabled
								defaultValue="Excellent communication skills and great relationship with their teachers"
							></textarea>
						</section>
					</aside>
				</div>
			</section>
		</div>
	</form>
</div>

<script lang="ts">
	import Dialog from '$lib/components/dialog.svelte';
	import { Select } from 'melt/components';
	import {
		add_announcement,
		delete_announcement,
		get_announcements,
		update_announcement
	} from './announcements.remote';
	import { toast } from 'svelte-sonner';
	import { format } from '@formkit/tempo';

	let selected_announcement = $state(null);
	let priority = $state('medium');
	let announcement_type = $state('general');
	let audience = $state('all');
	let toggle_dialog = $state(false);

	const { params } = $props();
	const { content, expires_at, is_active, target_audience, title, type } = add_announcement.fields;

	$inspect(add_announcement.fields.allIssues());

	$effect(() => {
		if (add_announcement.result?.message) {
			toast.success(add_announcement.result.message);
		}
	});

	function selectAnnouncement(announcement) {
		selected_announcement = announcement;
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'urgent':
				return 'bg-red-100 text-red-800';
			case 'event':
				return 'bg-blue-100 text-blue-800';
			case 'academic':
				return 'bg-purple-100 text-purple-800';
			case 'administrative':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'urgent':
				return 'icon-[mdi--alert-circle]';
			case 'event':
				return 'icon-[mdi--calendar-star]';
			case 'academic':
				return 'icon-[mdi--school]';
			case 'administrative':
				return 'icon-[mdi--office-building]';
			default:
				return 'icon-[mdi--bullhorn]';
		}
	}
</script>

<section class="max-w-7xl mx-auto p-6">
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Announcements</h1>
				<p class="text-gray-600">Manage school announcements and important notices</p>
			</div>
			<Dialog
				label="Add Announcement"
				btn_txt="New Announcement"
				icon="icon-[mdi--bullhorn]"
				{toggle_dialog}
			>
				<form
					{...add_announcement.enhance(async ({ submit }) => await submit())}
					oninput={() => add_announcement.validate()}
					class="space-y-4"
				>
					<input type="hidden" name="school_id" value={params.school_id} />
					<input type="hidden" name="priority" bind:value={priority} />
					<input type="hidden" name="type" bind:value={announcement_type} />
					<input type="hidden" name="audience" bind:value={audience} />

					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							Title <span class="text-red-500">*</span>
						</label>
						<input
							{...title.as('text')}
							type="text"
							placeholder="Important School Notice"
							class="input"
						/>
					</div>

					<div>
						<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
							Content <span class="text-red-500">*</span>
						</label>
						<textarea
							{...content.as('text')}
							rows="4"
							placeholder="Enter the announcement details..."
							class="textarea resize-none"
						></textarea>
					</div>

					<div>
						<Select bind:value={priority}>
							{#snippet children(select)}
								<label for={select.ids.trigger} class="label text-sm text-gray-700 mb-2">
									Priority <span class="text-red-500">*</span>
								</label>
								<button {...select.trigger} class="btn-outline w-full justify-between capitalize">
									{select.value || 'Select Priority'}
									<i class="icon-[lucide--chevron-down]"></i>
								</button>

								<div
									{...select.content}
									class="max-h-48 w-full rounded-lg border border-gray-300 text-sm bg-white"
								>
									{#each ['low', 'medium', 'high'] as priority}
										<p
											{...select.getOption(priority, priority)}
											class="{priority === select.value &&
												'bg-blue-50 text-blue-900'} p-3 hover:bg-gray-50 capitalize cursor-pointer"
										>
											{priority}
										</p>
									{/each}
								</div>
							{/snippet}
						</Select>
					</div>

					<div>
						<Select bind:value={announcement_type}>
							{#snippet children(select)}
								<label for={select.ids.trigger} class="label text-sm text-gray-700 mb-2">
									Type <span class="text-red-500">*</span>
								</label>
								<button {...select.trigger} class="btn-outline w-full justify-between capitalize">
									{select.value || 'Select Type'}
									<i class="icon-[lucide--chevron-down]"></i>
								</button>

								<div
									{...select.content}
									class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm bg-white"
								>
									{#each ['general', 'urgent', 'event', 'academic', 'administrative'] as type_item}
										<p
											{...select.getOption(type_item, type_item)}
											class="{type_item === select.value &&
												'bg-blue-50 text-blue-900'} p-3 hover:bg-gray-50 capitalize cursor-pointer"
										>
											{type_item}
										</p>
									{/each}
								</div>
							{/snippet}
						</Select>
					</div>

					<div>
						<Select bind:value={audience}>
							{#snippet children(select)}
								<label for={select.ids.trigger} class="label text-sm text-gray-700 mb-2">
									Target Audience <span class="text-red-500">*</span>
								</label>
								<button {...select.trigger} class="btn-outline w-full justify-between capitalize">
									{select.value || 'Select Type'}
									<i class="icon-[lucide--chevron-down]"></i>
								</button>

								<div
									{...select.content}
									class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm bg-white"
								>
									{#each ['all', 'students', 'staff'] as audience}
										<p
											{...select.getOption(audience, audience)}
											class="{audience === select.value &&
												'bg-blue-50 text-blue-900'} p-3 hover:bg-gray-50 capitalize cursor-pointer"
										>
											{audience}
										</p>
									{/each}
								</div>
							{/snippet}
						</Select>
					</div>

					<div class="flex justify-end gap-3 pt-4">
						<button type="submit" class="btn" disabled={add_announcement.pending > 0}>
							{#if add_announcement.pending > 0}
								<i class="icon-[mdi--loading] animate-spin"></i>
								Creating...
							{:else}
								<i class="icon-[mdi--bullhorn]"></i>
								Create Announcement
							{/if}
						</button>
					</div>
				</form>
			</Dialog>
		</div>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Announcements List -->
		<section class="lg:col-span-1 bg-white rounded-lg border shadow-sm">
			<header class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">All Announcements</h2>
			</header>

			<div class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
				{#each await get_announcements(params.school_id) as announcement}
					<button
						type="button"
						class="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors {selected_announcement?.id ===
						announcement.id
							? 'bg-blue-50 border-r-2 border-blue-500'
							: ''}"
						onclick={() => selectAnnouncement(announcement)}
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-2">
									<i class="{getTypeIcon(announcement.type)} text-gray-600 size-4"></i>
									<h3 class="font-medium text-gray-900 truncate">{announcement.title}</h3>
								</div>
								<div class="flex items-center gap-2 mb-2">
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getPriorityColor(
											announcement.priority
										)}"
									>
										{announcement.priority}
									</span>
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {announcement.is_active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'}"
									>
										{announcement.is_active ? 'Active' : 'Inactive'}
									</span>
								</div>
								<p class="text-xs text-gray-500">
									{format({ date: announcement.created_at, format: 'DDD MMM, YYYY' })}
								</p>
							</div>
							<i class="icon-[mdi--chevron-right] size-5 text-gray-400"></i>
						</div>
					</button>
				{:else}
					<div class="p-12 text-center">
						<div class="flex flex-col items-center">
							<i class="icon-[mdi--bullhorn] text-gray-300 size-12 mb-4"></i>
							<h3 class="text-sm font-medium text-gray-900 mb-2">No Announcements</h3>
							<p class="text-sm text-gray-500">Get started by creating your first announcement.</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Announcement Details -->
		<section class="lg:col-span-2">
			{#if selected_announcement}
				<article class="bg-white rounded-lg border shadow-sm">
					<header class="px-6 py-4 border-b border-gray-200">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-3">
									<i class="{getTypeIcon(selected_announcement.type)} text-gray-600 size-6"></i>
									<h2 class="text-xl font-semibold text-gray-900">
										{selected_announcement.title}
									</h2>
								</div>
								<div class="flex items-center gap-2">
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getPriorityColor(
											selected_announcement.priority
										)}"
									>
										{selected_announcement.priority}
									</span>
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(
											selected_announcement.type
										)}"
									>
										{selected_announcement.type}
									</span>
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {selected_announcement.is_active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'}"
									>
										{selected_announcement.is_active ? 'Active' : 'Inactive'}
									</span>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<button
									type="button"
									class="btn-sm {selected_announcement.is_active
										? 'text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100'
										: 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'}"
									onclick={async () => {
										await update_announcement({
											school_id: params.school_id,
											announcement_id: selected_announcement.id
										});
										toast.success(
											`Announcement ${selected_announcement.is_active ? 'deactivated' : 'activated'}`
										);
										// Update local state
										selected_announcement.is_active = !selected_announcement.is_active;
									}}
								>
									<i class="icon-[mdi--{selected_announcement.is_active ? 'pause' : 'play'}] size-4"
									></i>
									{selected_announcement.is_active ? 'Deactivate' : 'Activate'}
								</button>
								<button
									type="button"
									class="btn-sm-destructive"
									onclick={async () => {
										const confirmed = confirm(
											`Are you sure you want to delete "${selected_announcement.title}"?`
										);
										if (confirmed) {
											await delete_announcement({
												school_id: params.school_id,
												announcement_id: selected_announcement.id
											});
											toast.success('Announcement deleted successfully');
											selected_announcement = null;
										}
									}}
								>
									<i class="icon-[mdi--trash] size-4"></i>
									Delete
								</button>
							</div>
						</div>
					</header>

					<div class="p-6">
						<div class="mb-6">
							<h3 class="text-lg font-medium text-gray-900 mb-3">Content</h3>
							<div class="bg-gray-50 rounded-lg p-4">
								<p class="text-gray-700 leading-relaxed">{selected_announcement.content}</p>
							</div>
						</div>

						<dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Created Date</dt>
								<dd class="mt-1 text-sm text-gray-900">
									{format(selected_announcement.created_at, {
										dateStyle: 'full',
										timeStyle: 'short'
									})}
								</dd>
							</div>
							{#if selected_announcement.expires_at}
								<div>
									<dt class="text-sm font-medium text-gray-500">Expires</dt>
									<dd class="mt-1 text-sm text-gray-900">
										{format(selected_announcement.expires_at, {
											dateStyle: 'full',
											timeStyle: 'short'
										})}
									</dd>
								</div>
							{/if}
							{#if selected_announcement.target_audience}
								<div>
									<dt class="text-sm font-medium text-gray-500">Target Audience</dt>
									<dd class="mt-1 text-sm text-gray-900 capitalize">
										{selected_announcement.target_audience}
									</dd>
								</div>
							{/if}
							<div>
								<dt class="text-sm font-medium text-gray-500">Announcement ID</dt>
								<dd class="mt-1 text-sm font-mono text-gray-900">{selected_announcement.id}</dd>
							</div>
						</dl>
					</div>
				</article>
			{:else}
				<div class="bg-white rounded-lg border shadow-sm p-12 text-center">
					<div class="flex flex-col items-center">
						<i class="icon-[mdi--bullhorn] text-gray-300 size-16 mb-4"></i>
						<h3 class="text-lg font-medium text-gray-900 mb-2">Select an Announcement</h3>
						<p class="text-gray-500">Choose an announcement from the list to view its details</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</section>

<script lang="ts">
	import { Tabs } from 'melt/components';
	import Subjects from './subjects.svelte';
	import Classes from './classes.svelte';
	import Announcements from './announcements.svelte';

	const tab_ids = ['classes', 'subjects', 'announcements'] as const;
	type TabId = (typeof tab_ids)[number];
	let selected_tab: TabId = $state('classes');

	// change to switch case
	function get_tab_icon(id: TabId) {
		switch (id) {
			case 'classes':
				return 'icon-[mdi--google-classroom]';
			case 'subjects':
				return 'icon-[mdi--book-open-variant]';
			case 'announcements':
				return 'icon-[mdi--bullhorn]';
			default:
				return 'icon-[mdi--circle-outline]';
		}
	}
</script>

<section class="max-w-7xl mx-auto p-6">
	<header class="mb-8">
		<p class="text-gray-600">Manage your school's classes, subjects and announcements</p>
	</header>

	<div class="w-full">
		<Tabs bind:value={selected_tab}>
			{#snippet children(tabs)}
				<div {...tabs.triggerList} class="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
					{#each tab_ids as id}
						<button
							{...tabs.getTrigger(id)}
							class="btn-outline capitalize
                {selected_tab === id ? 'bg-blue-50  text-blue-700' : ' text-gray-600 '}"
						>
							<i class="{get_tab_icon(id)} size-5"></i>
							{id.replace('-', ' ')}
						</button>
					{/each}
				</div>

				{#if selected_tab === 'classes'}
					<div {...tabs.getContent('classes')}>
						<Classes />
					</div>
				{/if}

				{#if selected_tab === 'subjects'}
					<div {...tabs.getContent('subjects')}>
						<Subjects />
					</div>
				{/if}

				{#if selected_tab === 'announcements'}
					<div {...tabs.getContent('announcements')}>
						<Announcements />
					</div>
				{/if}
			{/snippet}
		</Tabs>
	</div>
</section>

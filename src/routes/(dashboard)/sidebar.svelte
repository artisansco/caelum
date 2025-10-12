<script lang="ts">
	import { Avatar } from 'melt/components';
	import { page } from '$app/state';
	import { get_school } from './school.remote';
	import { logout } from '../auth.remote';
	import { goto } from '$app/navigation';

	let tenant = $derived(String(page.params.school_id));
	let sch_promise = $derived(get_school(tenant));
	let school = $derived(await sch_promise);
</script>

<div class="fixed inset-y-0 start-0 z-60 h-full w-56 border-e border-gray-200 bg-white lg:block">
	<div class="relative flex h-full max-h-full flex-col">
		<!-- Logo Section -->
		<div class="flex-shrink-0 p-6">
			<Avatar src={String(school.logo_url)}>
				{#snippet children(avatar)}
					<img {...avatar.image} alt={school.name} class="size-16" />
					<span {...avatar.fallback} class="text-2xl font-bold">
						{school.name[0]}
					</span>
				{/snippet}
			</Avatar>
		</div>

		<!-- Navigation Section -->
		<nav class="flex-1 px-4 pb-4 overflow-y-auto">
			<ul class="space-y-2">
				{@render navigation_link(`/${tenant}`, 'icon-[mdi--view-dashboard]', 'Overview')}
				{@render navigation_link(`/${tenant}/students`, 'icon-[mdi--account-student]', 'Students')}
				{@render navigation_link(`/${tenant}/staff`, 'icon-[mdi--person-tie]', 'Staff')}
				{@render navigation_link(`/${tenant}/classes`, 'icon-[mdi--google-classroom]', 'Classes')}
				{@render navigation_link(
					`/${tenant}/subjects`,
					'icon-[mdi--book-open-variant]',
					'Subjects'
				)}
				{@render navigation_link(
					`/${tenant}/announcements`,
					'icon-[mdi--bullhorn]',
					'Announcements'
				)}
				{@render navigation_link(`/${tenant}/assignments`, 'icon-[mdi--assignment]', 'Assignments')}
				{@render navigation_link(`/${tenant}/grades`, 'icon-[mdi--school]', 'Grades')}
				{@render navigation_link(`/${tenant}/pricing`, 'icon-[mdi--receipt]', 'Pricing')}
				{@render navigation_link(`/${tenant}/payments`, 'icon-[mdi--receipt]', 'Payments')}
				{@render navigation_link(
					`/${tenant}/transactions`,
					'icon-[mdi--bank-transfer]',
					'Transactions'
				)}
				{@render navigation_link(`/${tenant}/account`, 'icon-[mdi--people]', 'Account')}
			</ul>
		</nav>

		<!-- Logout Section -->
		<div class="flex-shrink-0 p-4 border-t border-gray-200">
			<button
				type="button"
				class="btn-destructive w-full justify-start bg-red-400 hover:bg-red-600"
				disabled={logout.pending > 0}
				onclick={async () => {
					await logout();
					goto('/');
				}}
			>
				{#if logout.pending > 0}
					<i class="icon-[mdi--loading] animate-spin"></i>
					Logging out...
				{:else}
					<i class="icon-[mdi--logout]"></i>
					Logout
				{/if}
			</button>
		</div>
	</div>
</div>

{#snippet navigation_link(href: string, icon: string, label: string)}
	{@const path = page.url.pathname.split('/')[2]}
	{@const relative = href.split('/').at(-1)}
	<li class="*:w-full">
		<a {href} class="btn-ghost justify-start {path === relative ? 'bg-gray-300' : ''}">
			<i class={icon}></i>
			{label}
		</a>
	</li>
{/snippet}

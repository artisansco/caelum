<script lang="ts">
	import { Avatar } from 'melt/components';
	import { page } from '$app/state';
	import { get_school } from './school.remote';
	import { logout } from '../auth.remote';
	import { goto } from '$app/navigation';

	const tenant = $derived(String(page.params.school_id));
	const school = $derived(await get_school(tenant));
</script>

<div class="fixed inset-y-0 start-0 z-60 h-full w-54 border-e border-gray-200 bg-white lg:block">
	<div class="relative flex h-full max-h-full flex-col">
		<div class="p-4">
			<Avatar src={school.logo_url}>
				{#snippet children(avatar)}
					<img {...avatar.image} alt={school.name} class="size-20" />
					<span {...avatar.fallback} class="text-4xl font-extrabold">
						{school.name[0]}
					</span>
				{/snippet}
			</Avatar>
		</div>

		<aside class="mt-5 h-full overflow-y-auto">
			<nav class="flex w-full flex-col flex-wrap p-3">
				<ul class="flex flex-col space-y-1">
					{@render link(`/${tenant}`, 'icon-[mdi--view-dashboard]', 'Overview')}
					{@render link(`/${tenant}/students`, 'icon-[mdi--account-student]', 'Students')}
					<!-- {@render link(page.url.pathname, "icon-[mdi--bed]", "Rooms")} -->
					{@render link(`/${tenant}/staff`, 'icon-[mdi--person-tie]', 'Staff')}
					{@render link(`/${tenant}/misc`, 'icon-[mdi--tag-check]', 'Miscellaneous')}
					{@render link(`/${tenant}/assignments`, 'icon-[mdi--assignment]', 'Assignments')}
					<!-- {@render link(
            page.url.pathname,
            "icon-[mdi--calendar-task]",
            "Tasks",
          )} -->
					{@render link(`/${tenant}/billing`, 'icon-[mdi--cog]', 'Billings')}
					{@render link(`/${tenant}/account`, 'icon-[mdi--people]', 'Account')}

					<button
						type="button"
						class="btn-sm-destructive w-full mt-20"
						disabled={logout.pending > 0}
						onclick={async () => {
							await logout();
							goto('/');
						}}
					>
						{#if logout.pending > 0}
							<i class="icon-[mdi--logout] animate-spin"></i>
							Logging out...
						{:else}
							<i class="icon-[mdi--logout]"></i>
							Logout
						{/if}
					</button>
				</ul>
			</nav>
		</aside>
	</div>
</div>

{#snippet link(href: string, icon: string, label: string)}
	<li>
		<a {href} class="btn-ghost w-full justify-start text-gray-700">
			<span class={icon}></span>
			{label}
		</a>
	</li>
{/snippet}

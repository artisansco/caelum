<script lang="ts">
  import { Avatar } from "melt/components";
  import { page } from "$app/state";
  import { get_school } from "./school.remote";

  const tenant = $derived(String(page.params.school_id));
  const school = $derived(await get_school(tenant));
</script>

<div
  class="fixed inset-y-0 start-0 z-60 h-full w-60 border-e border-gray-200 bg-white lg:block"
>
  <div class="relative flex h-full max-h-full flex-col">
    <div class="flex items-center justify-between px-6 pt-4">
      <a
        href={page.url.pathname}
        class="flex items-center rounded-full size-20 overflow-clip justify-center"
      >
        <Avatar
          src={school.logo_url ||
            `https://placehold.co/400?text=${school.name[0]}`}
        >
          {#snippet children(avatar)}
            <img {...avatar.image} alt={school.name} class="size-20" />
            <span {...avatar.fallback} class="text-4xl font-extrabold">
              {school.name[0]}
            </span>
          {/snippet}
        </Avatar>
      </a>
    </div>

    <aside class="mt-5 h-full overflow-y-auto">
      <nav class="flex w-full flex-col flex-wrap p-3">
        <ul class="flex flex-col space-y-1">
          {@render link(`/${tenant}`, "icon-[mdi--view-dashboard]", "Overview")}
          {@render link(
            `/${tenant}/students`,
            "icon-[mdi--account-student]",
            "Students",
          )}
          <!-- {@render link(page.url.pathname, "icon-[mdi--people-group]", "Staff")} -->
          <!-- {@render link(page.url.pathname, "icon-[mdi--bed]", "Rooms")} -->
          {@render link(`/${tenant}/staff`, "icon-[mdi--person-tie]", "Staff")}
          {@render link(
            `/${tenant}/misc`,
            "icon-[mdi--tag-check]",
            "Miscellaneous",
          )}
          {@render link(
            `/${tenant}/assignments`,
            "icon-[mdi--assignment]",
            "Assignments",
          )}
          <!-- {@render link(
            page.url.pathname,
            "icon-[mdi--calendar-task]",
            "Tasks",
          )} -->
          {@render link(`/${tenant}/billing`, "icon-[mdi--cog]", "Billings")}
        </ul>
      </nav>
    </aside>
  </div>
</div>

{#snippet link(href: string, icon: string, label: string)}
  <li>
    <a
      {href}
      class="flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100"
    >
      <span class="{icon} size-5"></span>
      {label}
    </a>
  </li>
{/snippet}

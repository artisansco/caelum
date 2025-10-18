<script lang="ts">
  import { page } from "$app/state";
  import { get_school } from "./school.remote";
  import { Avatar, Popover } from "melt/components";

  const school = $derived(await get_school(String(page.params.school_id)));
</script>

<header
  class="sticky inset-x-0 top-0 z-48 flex w-full flex-wrap border-b border-gray-200 bg-white py-2.5 lg:ps-65"
>
  <nav class="mx-auto flex w-full items-center px-4 sm:px-6">
    <div class="ms-auto flex w-full items-center justify-end gap-x-3">
      <div class="mr-auto -ml-5">
        <p class="font-bold">{school.name}</p>
        <p class="label font-light">
          Current Plan: <span class="badge">{school.current_plan?.name}</span>
        </p>
      </div>

      <div class="flex flex-row items-center justify-end gap-1">
        <button type="button" class="btn-sm-ghost">
          <span class="icon-[lucide--bell] size-4"></span>
          <span class="sr-only text-xs">Notifications</span>
        </button>

        <!-- <button type="button" class="btn-sm-ghost">
					<span class="icon-[lucide--activity] size-4"></span>
					<span class="sr-only text-xs">Activity</span>
				</button> -->

        <Popover sameWidth={false}>
          {#snippet children(popover)}
            <button {...popover.trigger} class="">
              <Avatar src={school.logo_url || `https://placehold.co/400?text=${school.name[0]}`}>
                {#snippet children(avatar)}
                  <img {...avatar.image} alt={school.name} class="size-10 rounded-full" />
                  <span {...avatar.fallback} class="text-xs">
                    {school.name[0]}
                  </span>
                {/snippet}
              </Avatar>
            </button>

            <div
              {...popover.content}
              class="max-w-60 rounded border border-gray-500/30 bg-white shadow-lg"
            >
              <div {...popover.arrow}></div>
              <div class="p-4">
                <div class="btn-sm-ghost w-full font-bold text-gray-900">
                  <span class="icon-[lucide--user] size-4"></span>
                  Jack Smith
                </div>
                <div class="ml-5 text-sm text-gray-500">Manager</div>
                <div class="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <span class="icon-[lucide--mail] size-4"></span>
                  jacksmith@gmail.com
                </div>
              </div>
              <hr class="mx-auto h-0.5 w-[90%] border-0 bg-gray-500/20" />
              <a
                href="/{school.id}/staff/name"
                class="mt-2 flex w-full items-center gap-2 rounded p-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                <span class="icon-[lucide--cog] size-4"></span>
                Profile
              </a>
            </div>
          {/snippet}
        </Popover>
      </div>
    </div>
  </nav>
</header>

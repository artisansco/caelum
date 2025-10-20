<script lang="ts">
  import Dialog from "$lib/components/dialog.svelte";
  import { Select } from "melt/components";
  import { add_announcement, delete_announcement } from "./announcements.remote";
  import { toast } from "svelte-sonner";
  import { format } from "@formkit/tempo";
  import { announcement_audience, announcement_priority, announcement_types } from "$lib/constants";
  import { dialog_state } from "$lib/dialog-state.svelte";
  import { get_field_error, get_priority_color, get_type_icon } from "$lib/utils";

  const { data, params } = $props();
  let announcements = $derived(data.announcements);

  let selected_announcement: (typeof announcements)[number] | null = $state(null);
  let priority: (typeof announcement_priority)[number] = $state("medium");
  let announcement_type: (typeof announcement_types)[number] = $state("general");
  let audience: (typeof announcement_audience)[number] = $state("all");

  const { content, target_audience, title, type } = add_announcement.fields;

  $inspect({ issues: add_announcement.fields.allIssues() });

  $effect(() => {
    if (add_announcement.result?.message) {
      toast.success(add_announcement.result.message);
    }
  });


</script>

<section class="max-w-7xl mx-auto p-6">
  <header class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Announcements</h1>
        <p class="text-gray-600">Manage school announcements and important notices</p>
      </div>
      <Dialog label="Add Announcement" btn_txt="New Announcement" icon="icon-[mdi--bullhorn]">
        <form
          {...add_announcement.enhance(async ({ submit }) => {
            await submit();
            // dialog_state.open = false;
          })}
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
              {...title.as("text")}
              type="text"
              placeholder="Important School Notice"
              class="input"
            />
            <span class="text-xs text-red-500 mt-1">{get_field_error(title)}</span>
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
              Content <span class="text-red-500">*</span>
            </label>
            <textarea
              {...content.as("text")}
              rows="4"
              placeholder="Enter the announcement details..."
              class="textarea resize-none"
            ></textarea>
            <span class="text-xs text-red-500 mt-1">{get_field_error(content)}</span>
          </div>

          <div>
            <Select bind:value={priority}>
              {#snippet children(select)}
                <label for={select.ids.trigger} class="label text-sm text-gray-700 mb-2">
                  Priority <span class="text-red-500">*</span>
                </label>
                <button {...select.trigger} class="btn-outline w-full justify-between capitalize">
                  {select.value || "Select Priority"}
                  <i class="icon-[lucide--chevron-down]"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full rounded-lg border border-gray-300 text-sm bg-white"
                >
                  {#each announcement_priority as priority}
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
                  {select.value || "Select Type"}
                  <i class="icon-[lucide--chevron-down]"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm bg-white"
                >
                  {#each announcement_types as type_item}
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
                  {select.value || "Select Type"}
                  <i class="icon-[lucide--chevron-down]"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm bg-white"
                >
                  {#each announcement_audience as audience}
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
        <h2 class="text-lg font-semibold text-gray-900">
          All Announcements ({announcements.length})
        </h2>
      </header>

      <div class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {#each announcements as announcement}
          <button
            type="button"
            class="w-full text-left p-4 hover:bg-gray-50 transition-colors {selected_announcement?.id ===
            announcement.id
              ? 'bg-blue-50 border-r border-blue-500'
              : ''}"
            onclick={() => (selected_announcement = announcement)}
          >
            <div class="flex items-center justify-between">
              <div class="">
                <h3 class="font-medium text-gray-900 truncate line-clamp-1 text-wrap">
                  {announcement.title}
                </h3>

                <div class="flex items-center gap-2 mb-2">
                  <span class="badge {get_priority_color(announcement.priority)}">
                    {announcement.priority}
                  </span>
                  <span class="badge">{announcement.target_audience}</span>
                </div>
                <p class="text-xs text-gray-500">{format(announcement.created_at)}</p>
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
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="{get_type_icon(selected_announcement.type)} text-gray-600 size-5"></i>
                <h2 class="font-semibold text-gray-900">{selected_announcement.title}</h2>
              </div>

              <Dialog
                label="Delete Announcement"
                trigger_class="btn-sm-destructive"
                icon="icon-[mdi--trash]"
              >
                <div class="space-y-4">
                  <p>Are you sure you want to delete this announcement??</p>

                  <button
                    type="button"
                    class="btn-sm-destructive"
                    onclick={async () => {
                      await delete_announcement(String(selected_announcement?.id));
                      dialog_state.open = false;
                      selected_announcement = null;
                    }}
                  >
                    <i class="icon-[mdi--trash]"></i>
                    <span class="">Delete Announcement</span>
                  </button>
                </div>
              </Dialog>
            </div>
          </header>

          <div class="p-6">
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Content</h3>
              <div class="bg-gray-10">
                <p class="text-gray-700 text-sm leading-relaxed">{selected_announcement.content}</p>
              </div>
            </div>

            <dl class="flex gap-6 divide-x-2 *:px-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Posted on</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {format(selected_announcement.created_at)}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Audience</dt>
                <dd class="mt-1 text-sm text-gray-900 capitalize">
                  {selected_announcement.target_audience}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Priority</dt>
                <dd class="mt-1 text-sm font-mono text-gray-900">
                  {selected_announcement.priority}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Announcement Type</dt>
                <dd class="mt-1 text-sm font-mono text-gray-900">{selected_announcement.type}</dd>
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

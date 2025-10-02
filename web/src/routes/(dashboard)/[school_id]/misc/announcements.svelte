<script>
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";
  import { Select } from "melt/components";
  import {
    add_announcement,
    delete_announcement,
    get_announcements,
    toggle_announcement_status,
  } from "./misc.remote";

  let priority = $state("medium");
  let announcement_type = $state("general");

  $effect(() => {
    if (add_announcement.result?.message) {
      toast.info(add_announcement.result.message);
    }
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getTypeColor(type) {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "event":
        return "bg-blue-100 text-blue-800";
      case "academic":
        return "bg-purple-100 text-purple-800";
      case "administrative":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getTypeIcon(type) {
    switch (type) {
      case "urgent":
        return "icon-[mdi--alert-circle]";
      case "event":
        return "icon-[mdi--calendar-star]";
      case "academic":
        return "icon-[mdi--school]";
      case "administrative":
        return "icon-[mdi--office-building]";
      default:
        return "icon-[mdi--bullhorn]";
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Announcements List -->
  <div class="lg:col-span-2">
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          School Announcements
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Manage important announcements and notices for your school
        </p>
      </div>

      <div class="divide-y divide-gray-200">
        {#each await get_announcements(page.params.school_id) as announcement}
          <div class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="flex items-center gap-2">
                    <i
                      class="{getTypeIcon(
                        announcement.type,
                      )} text-gray-600 size-5"
                    ></i>
                    <h4 class="text-base font-semibold text-gray-900">
                      {announcement.title}
                    </h4>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getPriorityColor(
                        announcement.priority,
                      )}"
                    >
                      {announcement.priority}
                    </span>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(
                        announcement.type,
                      )}"
                    >
                      {announcement.type}
                    </span>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {announcement.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'}"
                    >
                      {announcement.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <p class="text-sm text-gray-700 mb-3 leading-relaxed">
                  {announcement.content}
                </p>

                <div class="flex items-center text-xs text-gray-500 space-x-4">
                  <div class="flex items-center gap-1">
                    <i class="icon-[mdi--calendar] size-3"></i>
                    <span>Created: {formatDate(announcement.created_at)}</span>
                  </div>
                  {#if announcement.expires_at}
                    <div class="flex items-center gap-1">
                      <i class="icon-[mdi--calendar-end] size-3"></i>
                      <span>Expires: {formatDate(announcement.expires_at)}</span
                      >
                    </div>
                  {/if}
                  {#if announcement.target_audience}
                    <div class="flex items-center gap-1">
                      <i class="icon-[mdi--account-group] size-3"></i>
                      <span>For: {announcement.target_audience}</span>
                    </div>
                  {/if}
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <button
                  type="button"
                  class="btn-sm {announcement.is_active
                    ? 'text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100'
                    : 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'}"
                  onclick={async () => {
                    await toggle_announcement_status({
                      school_id: page.params.school_id,
                      announcement_id: announcement.id,
                    });
                    toast.success(
                      `Announcement ${announcement.is_active ? "deactivated" : "activated"}`,
                    );
                  }}
                >
                  <i
                    class="icon-[mdi--{announcement.is_active
                      ? 'pause'
                      : 'play'}] size-4"
                  ></i>
                  <span class="sr-only"
                    >{announcement.is_active ? "Deactivate" : "Activate"}</span
                  >
                </button>
                <button
                  type="button"
                  class="btn-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                  onclick={async () => {
                    const confirmed = confirm(
                      `Are you sure you want to delete "${announcement.title}"?`,
                    );
                    if (confirmed) {
                      await delete_announcement({
                        school_id: page.params.school_id,
                        announcement_id: announcement.id,
                      });
                      toast.success("Announcement deleted successfully");
                    }
                  }}
                >
                  <i class="icon-[mdi--trash-can-outline] size-4"></i>
                  <span class="sr-only">Delete</span>
                </button>
              </div>
            </div>
          </div>
        {:else}
          <div class="p-12 text-center">
            <div class="flex flex-col items-center">
              <i class="icon-[mdi--bullhorn] text-gray-300 text-4xl mb-4"></i>
              <h3 class="text-sm font-medium text-gray-900 mb-2">
                No Announcements
              </h3>
              <p class="text-sm text-gray-500">
                Get started by creating your first announcement.
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Form to add announcements -->
  <div class="lg:col-span-1">
    <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
      <form {...add_announcement}>
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <i class="icon-[mdi--plus-circle] size-5 mr-2 text-blue-600"></i>
          New Announcement
        </h3>

        <fieldset class="space-y-6">
          <input type="hidden" name="school_id" value={page.params.school_id} />
          <input type="hidden" name="priority" bind:value={priority} />
          <input type="hidden" name="type" bind:value={announcement_type} />

          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Important School Notice"
              class="input"
              required
            />
            <p class="text-xs text-red-500 mt-1">
              {add_announcement.issues?.title?.at(0)?.message}
            </p>
          </div>

          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Content <span class="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              placeholder="Enter the announcement details..."
              class="textarea resize-none"
              required
            ></textarea>
            <p class="text-xs text-red-500 mt-1">
              {add_announcement.issues?.content?.at(0)?.message}
            </p>
          </div>

          <div>
            <Select bind:value={priority}>
              {#snippet children(select)}
                <label
                  for={select.ids.trigger}
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority <span class="text-red-500">*</span>
                </label>
                <button
                  {...select.trigger}
                  class="btn-outline w-full justify-between capitalize"
                >
                  {select.value || "Select Priority"}
                  <i class="icon-[lucide--chevron-down] size-5"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none bg-white shadow-lg z-50"
                >
                  {#each ["low", "medium", "high"] as priorityOption}
                    <p
                      {...select.getOption(priorityOption, priorityOption)}
                      class="{priorityOption === select.value &&
                        'bg-blue-50 text-blue-900'} p-3 hover:bg-gray-50 capitalize cursor-pointer"
                    >
                      {priorityOption}
                    </p>
                  {/each}
                </div>
              {/snippet}
            </Select>
          </div>

          <div>
            <Select bind:value={announcement_type}>
              {#snippet children(select)}
                <label
                  for={select.ids.trigger}
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type <span class="text-red-500">*</span>
                </label>
                <button
                  {...select.trigger}
                  class="btn-outline w-full justify-between capitalize"
                >
                  {select.value || "Select Type"}
                  <i class="icon-[lucide--chevron-down] size-5"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none bg-white shadow-lg z-50"
                >
                  {#each ["general", "urgent", "event", "academic", "administrative"] as typeOption}
                    <p
                      {...select.getOption(typeOption, typeOption)}
                      class="{typeOption === select.value &&
                        'bg-blue-50 text-blue-900'} p-3 hover:bg-gray-50 capitalize cursor-pointer"
                    >
                      {typeOption}
                    </p>
                  {/each}
                </div>
              {/snippet}
            </Select>
          </div>

          <div>
            <label
              for="target_audience"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Target Audience
            </label>
            <select id="target_audience" name="target_audience" class="input">
              <option value="">All</option>
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="parents">Parents</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div>
            <label
              for="expires_at"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Expires At
            </label>
            <input
              type="datetime-local"
              id="expires_at"
              name="expires_at"
              class="input"
            />
            <p class="text-xs text-gray-500 mt-1">
              Leave empty for permanent announcement
            </p>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked
              class="checkbox mr-3"
            />
            <label for="is_active" class="text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <button
            type="submit"
            class="btn w-full"
            disabled={add_announcement.pending > 0}
          >
            {#if add_announcement.pending > 0}
              <i class="icon-[mdi--loading] animate-spin mr-2"></i>
              Creating...
            {:else}
              <i class="icon-[mdi--bullhorn] mr-2"></i>
              Create Announcement
            {/if}
          </button>
        </fieldset>
      </form>
    </div>
  </div>
</div>

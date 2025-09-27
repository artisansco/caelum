<script>
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";
  import {
    add_school_year,
    delete_school_year,
    get_school_years,
    set_active_school_year,
  } from "./misc.remote";

  $effect(() => {
    if (add_school_year.result?.message) {
      toast.info(add_school_year.result.message);
    }
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isCurrentYear(startDate, endDate) {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  }
</script>

<div class="grid grid-cols-[1fr_25rem] gap-8">
  <!-- Table -->
  <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Academic Years</h3>
      <p class="text-sm text-gray-600 mt-1">
        Manage your school's academic calendar years
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="table min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left">
              <span class="text-xs font-semibold text-gray-700 uppercase">
                Academic Year
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-left">
              <span class="text-xs font-semibold text-gray-700 uppercase">
                Start Date
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-left">
              <span class="text-xs font-semibold text-gray-700 uppercase">
                End Date
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-left">
              <span class="text-xs font-semibold text-gray-700 uppercase">
                Status
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-right">
              <span class="text-xs font-semibold text-gray-700 uppercase">
                Actions
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          {#each await get_school_years(page.params.school_id) as schoolYear}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900">
                    {schoolYear.name}
                  </span>
                  {#if schoolYear.is_active}
                    <span
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      Active
                    </span>
                  {/if}
                  {#if isCurrentYear(schoolYear.start_date, schoolYear.end_date)}
                    <span
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Current
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">
                  {formatDate(schoolYear.start_date)}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">
                  {formatDate(schoolYear.end_date)}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  {schoolYear.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'}"
                >
                  {schoolYear.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  {#if !schoolYear.is_active}
                    <button
                      type="button"
                      class="btn-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                      onclick={async () => {
                        await set_active_school_year({
                          school_id: page.params.school_id,
                          year_id: schoolYear.id,
                        });
                        toast.success("Academic year activated");
                      }}
                    >
                      <i class="icon-[mdi--check-circle] size-4"></i>
                      Activate
                    </button>
                  {/if}
                  <button
                    type="button"
                    class="btn-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                    onclick={async () => {
                      if (schoolYear.is_active) {
                        toast.error("Cannot delete the active academic year");
                        return;
                      }
                      const confirmed = confirm(
                        `Are you sure you want to delete "${schoolYear.name}"?`,
                      );
                      if (confirmed) {
                        await delete_school_year({
                          school_id: page.params.school_id,
                          year_id: schoolYear.id,
                        });
                        toast.success("Academic year deleted");
                      }
                    }}
                  >
                    <i class="icon-[mdi--trash] size-4"></i>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <i
                    class="icon-[mdi--calendar-range] text-gray-300 text-4xl mb-4"
                  ></i>
                  <h3 class="text-sm font-medium text-gray-900 mb-2">
                    No Academic Years
                  </h3>
                  <p class="text-sm text-gray-500">
                    Get started by adding your first academic year.
                  </p>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Form to add school years -->
  <aside class="bg-white rounded-lg shadow-sm border p-6 h-fit">
    <form {...add_school_year}>
      <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <i class="icon-[mdi--calendar-plus] size-5 mr-2 text-blue-600"></i>
        Add Academic Year
      </h3>

      <fieldset class="space-y-6">
        <input type="hidden" name="school_id" value={page.params.school_id} />

        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Academic Year Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="2024-2025"
            class="input"
            required
          />
          <p class="text-xs text-red-500 mt-1">
            {add_school_year.issues?.name?.at(0)?.message}
          </p>
        </div>

        <div>
          <label
            for="start_date"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            class="input"
            required
          />
          <p class="text-xs text-red-500 mt-1">
            {add_school_year.issues?.start_date?.at(0)?.message}
          </p>
        </div>

        <div>
          <label
            for="end_date"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            End Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            class="input"
            required
          />
          <p class="text-xs text-red-500 mt-1">
            {add_school_year.issues?.end_date?.at(0)?.message}
          </p>
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            class="checkbox mr-3"
          />
          <label for="is_active" class="text-sm text-gray-700">
            Set as active academic year
          </label>
        </div>

        <button
          type="submit"
          class="btn w-full"
          disabled={add_school_year.pending > 0}
        >
          {#if add_school_year.pending > 0}
            <i class="icon-[mdi--loading] animate-spin mr-2"></i>
            Adding Year...
          {:else}
            <i class="icon-[mdi--calendar-plus] mr-2"></i>
            Add Academic Year
          {/if}
        </button>
      </fieldset>
    </form>
  </aside>
</div>

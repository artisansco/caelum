<script lang="ts">
  import { format } from "@formkit/tempo";
  import Avatar from "$lib/components/avatar.svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  const { data } = $props();

  function handle_prev() {
    const current = Number(page.url.searchParams.get("page")) || 1;
    if (current > 1) {
      const url = new URL(page.url);
      url.searchParams.set("page", String(current - 1));
      goto(url.toString());
    }
  }

  function handle_next() {
    const current = Number(page.url.searchParams.get("page")) || 1;
    const url = new URL(page.url);
    url.searchParams.set("page", String(current + 1));
    goto(url.toString());
  }
</script>

<!-- Table Section -->
<div class="max-w-[90rem] px-4 py-10">
  <!-- Card -->
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
          <!-- Header -->
          <div
            class="grid gap-3 border-b border-gray-200 px-6 py-4 md:flex md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800">
                ({data.students.length}) - Students
              </h2>
              <p class="text-sm text-gray-600">Add students, view, edit and more.</p>
            </div>

            <div>
              <div class="inline-flex gap-x-2">
                <!-- <a
									class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
									href="#"
								>
									View all
								</a> -->

                <a class="btn-sm" href="{page.url.pathname}/new">
                  <span class="icon-[lucide--plus] size-4"></span>
                  Add student
                </a>
              </div>
            </div>
          </div>
          <!-- End Header -->

          <!-- Table -->
          <table class="table min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                {@render table_header("Name")}
                {@render table_header("Class")}
                {@render table_header("Contact")}
                {@render table_header("Status")}
                {@render table_header("Admission Date")}
                <th scope="col" class="px-6 py-3 text-end"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              {#each data.students as student (student.id)}
                {@render student_card(student)}
              {:else}
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center">no data</td>
                </tr>
              {/each}
            </tbody>
          </table>
          <!-- End Table -->

          <!-- Footer -->
          <div class="flex items-center border-t border-gray-200 px-6 py-4">
            <div class="inline-flex gap-x-4">
              <button type="button" class="btn-sm-outline" onclick={handle_prev}>
                <span class="icon-[lucide--chevron-left]"></span>
                Prev
              </button>

              <button type="button" class="btn-sm-outline" onclick={handle_next}>
                Next
                <span class="icon-[lucide--chevron-right]"></span>
              </button>
            </div>
          </div>
          <!-- End Footer -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Card -->
</div>
<!-- End Table Section -->

{#snippet table_header(label: string)}
  <th scope="col" class="px-6 py-3 text-start">
    <div class="flex items-center gap-x-2">
      <span class="text-xs font-semibold text-gray-800 uppercase">{label}</span>
    </div>
  </th>
{/snippet}

{#snippet student_card(student: any)}
  <tr>
    <td class="size-px whitespace-nowrap">
      <div class="py-3 ps-6 pe-6 lg:ps-3 xl:ps-0">
        <div class="flex items-center gap-x-3">
          <Avatar
            src={student.avatar_url || `https://robohash.org/${student.first_name}`}
            alt={student.first_name}
            fallback_text={`${student.first_name[0]}${student.last_name[0]}`}
            img_class="text-xs"
            class="text-xs"
          />

          <div class="grow">
            <span class="block text-sm font-semibold text-gray-800">
              {student.first_name}
              {student.middle_name}
              {student.last_name}
            </span>
            <span class="block text-sm text-gray-500">{student.email}</span>
          </div>
        </div>
      </div>
    </td>
    <td class="h-px w-72 whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="block text-sm font-semibold text-gray-800">
          {student.class?.name || "N/A"}
        </span>
        <span class="block text-sm text-gray-500">
          {student.status || "enrolled"}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
          {student.phone_number || "N/A"}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="badge bg-teal-100 text-xs font-medium text-teal-800">
          <span class="icon-[mdi--check-circle]"></span>
          <!-- <span class="icon-[mdi--warning]"></span> -->
          {student.status}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
          {format({ date: student.admission_date, format: "DD MMM, YYYY" })}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-1.5">
        <a class="btn-sm-link text-blue-600" href="{page.url.pathname}/{student.id}">
          <span class="icon-[mdi--eye] size-4"></span>
          <span class="sr-only">view</span>
        </a>
      </div>
    </td>
  </tr>
{/snippet}

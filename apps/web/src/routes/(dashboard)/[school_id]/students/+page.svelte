<script lang="ts">
import { format } from "@formkit/tempo";
import { Avatar } from "melt/components";
import { page } from "$app/state";
import { get_staff } from "./students.remote";

type Staff = {
	id: number;
	name: string;
	email: string;
	contact: string;
	username: string;
	employee_id: string;
	role: string;
	department: string;
	shift: string;
	status: string;
	hire_date: string | Date;
	salary: number;
	avatar: string;
	certifications: string | string[];
	notes: string;
};
</script>

<!-- Table Section -->
<div class="max-w-[90rem] px-4 py-10">
  <!-- Card -->
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs"
        >
          <!-- Header -->
          <div
            class="grid gap-3 border-b border-gray-200 px-6 py-4 md:flex md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Students</h2>
              <p class="text-sm text-gray-600">
                Add students, view, edit and more.
              </p>
            </div>

            <div>
              <div class="inline-flex gap-x-2">
                <!-- <a
									class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
									href="#"
								>
									View all
								</a> -->

                <a class="btn btn-sm" href={page.url.pathname}>
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
                {@render table_header("Unknown")}
                {@render table_header("Contact")}
                {@render table_header("Status")}
                {@render table_header("joined on")}
                <th scope="col" class="px-6 py-3 text-end"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              {#await get_staff() then staff}
                {#each staff as person}
                  {@render staff_card(person)}
                {:else}
                  <tr>
                    <td colspan="6" class="px-6 py-4 text-center">no data</td>
                  </tr>
                {/each}
              {/await}
            </tbody>
          </table>
          <!-- End Table -->

          <!-- Footer -->
          <div
            class="grid gap-3 border-t border-gray-200 px-6 py-4 md:flex md:items-center md:justify-between"
          >
            <div>
              <p class="text-sm text-gray-600">
                <svelte:boundary>
                  <span class="font-semibold text-gray-800"
                    >{(await get_staff()).length || 0}</span
                  >
                  results
                  {#snippet pending()}
                    <span>0</span>
                  {/snippet}
                </svelte:boundary>
              </p>
            </div>

            <div class="inline-flex gap-x-4">
              <button type="button" class="btn-outline">
                <span class="icon-[lucide--chevron-left]"></span>
                Prev
              </button>

              <button type="button" class="btn-outline">
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

{#snippet staff_card(staff: Staff)}
  <tr>
    <td class="size-px whitespace-nowrap">
      <div class="py-3 ps-6 pe-6 lg:ps-3 xl:ps-0">
        <div class="flex items-center gap-x-3">
          <Avatar src={staff.avatar}>
            {#snippet children(avatar)}
              <img
                {...avatar.image}
                alt={staff.name}
                class="size-10 rounded-full text-xs"
              />
              <span {...avatar.fallback} class="text-xs">&hellip;</span>
            {/snippet}
          </Avatar>

          <div class="grow">
            <span class="block text-sm font-semibold text-gray-800"
              >{staff.name}</span
            >
            <span class="block text-sm text-gray-500">{staff.email}</span>
          </div>
        </div>
      </div>
    </td>
    <td class="h-px w-72 whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="block text-sm font-semibold text-gray-800"
          >{staff.role}</span
        >
        <span class="block text-sm text-gray-500">{staff.department}</span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
          {staff.contact}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span
          class="inline-flex items-center gap-x-1 rounded-full bg-teal-100 px-1.5 py-1 text-xs font-medium text-teal-800"
        >
          <span class="icon-[mdi--check-circle]"></span>
          <!-- <span class="icon-[mdi--warning]"></span> -->
          {staff.status}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
          {format({ date: staff.hire_date, format: "DD MMM, HH:mm" })}
        </span>
      </div>
    </td>
    <td class="size-px whitespace-nowrap">
      <div class="px-6 py-1.5">
        <a
          class="btn-link text-sm text-blue-600"
          href="{page.url.pathname}/{staff.id}"
        >
          <span class="icon-[mdi--eye] size-4"></span>
          <span class="sr-only">view</span>
        </a>
      </div>
    </td>
  </tr>
{/snippet}

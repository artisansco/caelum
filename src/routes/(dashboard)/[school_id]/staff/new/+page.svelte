<script lang="ts">
  import { Select } from "melt/components";
  import { toast } from "svelte-sonner";
  import { employment_types, permissions as staff_permissions, staff_roles } from "$lib/constants";
  import { format_permissions } from "$lib/utils";
  import { add_staff } from "../staff.remote";

  const {
    address,
    email,
    employed_on,
    first_name,
    last_name,
    middle_name,
    password,
    permissions,
    phone_number,
    staff_id,
  } = add_staff.fields;

  const { params } = $props();
  let role: (typeof staff_roles)[number] = $state("staff");
  let employee_type: (typeof employment_types)[number] = $state("full-time");

  $effect(() => {
    if (add_staff.result?.message) {
      toast.info(add_staff.result.message);
    }
  });

  $inspect(add_staff.fields.issues());

  function generate_staff_id() {
    staff_id.set(Math.random().toString(36).substring(2, 15).toUpperCase());
  }
</script>

<section class="max-w-6xl">
  <form {...add_staff} oninput={() => add_staff.validate()}>
    <h2 class="mb-6 text-xl">Add new staff</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <input type="hidden" value={params.school_id} name="school_id" />
      <input type="hidden" bind:value={role} name="role" />
      <input type="hidden" bind:value={employee_type} name="employee_type" />

      <div class="flex flex-col space-y-2">
        <label for="first_name" class="label text-gray-500">First Name</label>
        <input {...first_name.as("text")} type="text" placeholder="John" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="middle_name" class="label text-gray-500">Middle Name</label>
        <input {...middle_name.as("text")} type="text" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="last_name" class="label text-gray-500">Last Name</label>
        <input {...last_name.as("text")} type="text" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="staff_id" class="label text-gray-500">Staff ID</label>
        <div class="flex items-center gap-x-3">
          <input {...staff_id.as("text")} type="text" class="input" />
          <button type="button" class="btn-sm" onclick={generate_staff_id}>
            <i class="icon-[mdi--rotate-clockwise]"></i>
            <span class="sr-only text-xs">generate</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="email" class="label text-gray-500">Email</label>
        <input {...email.as("email")} type="email" placeholder="me@acme.com" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="employed_on" class="label text-gray-500"> Employed Date </label>
        <input {...employed_on.as("date")} type="date" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="address" class="label text-gray-500">Address</label>
        <input {...address.as("text")} type="text" placeholder="2 Wise lane" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="phone_number" class="label text-gray-500"> Phone Number </label>
        <input {...phone_number.as("tel")} type="tel" placeholder="+232-99-456-890" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="password" class="label text-gray-500">Password</label>
        <input {...password.as("password")} type="password" placeholder="********" class="input" />
      </div>

      <div>
        <Select bind:value={role}>
          {#snippet children(select)}
            <label for={select.ids.trigger} class="label mb-2 text-sm text-gray-500"> Role </label>
            <button {...select.trigger} class="btn-outline w-full justify-between capitalize">
              {select.value || "Select role"}
              <i class="icon-[lucide--chevron-down]"></i>
            </button>

            <div
              {...select.content}
              class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
            >
              {#each staff_roles as role}
                <p
                  {...select.getOption(role, role)}
                  class="{role === select.value &&
                    'bg-gray-100'} btn-sm-ghost w-full justify-start capitalize"
                >
                  {role}
                </p>
              {/each}
            </div>
          {/snippet}
        </Select>
      </div>

      <div>
        <Select bind:value={employee_type}>
          {#snippet children(select)}
            <label for={select.ids.trigger} class="label mb-2 text-sm text-gray-500">
              Employment Type
            </label>
            <button {...select.trigger} class="btn-outline w-full justify-between capitalize">
              {select.value || "Select employment type"}
              <i class="icon-[lucide--chevron-down]"></i>
            </button>

            <div
              {...select.content}
              class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
            >
              {#each employment_types as emp_type}
                <p
                  {...select.getOption(emp_type, emp_type)}
                  class="{emp_type === select.value &&
                    'bg-gray-100'} btn-sm-ghost justify-start w-full capitalize"
                >
                  {emp_type}
                </p>
              {/each}
            </div>
          {/snippet}
        </Select>
      </div>

      <div class="flex flex-col md:col-span-2">
        <p class="mb-2 text-sm font-medium text-gray-500">Permissions</p>
        <div class="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {#each staff_permissions as permission}
            <label class="label capitalize flex items-center text-gray-600">
              <input
                {...permissions.as("checkbox", permission)}
                class="checkbox rounded border-gray-400"
              />
              {format_permissions(permission)}
            </label>
          {/each}
        </div>
      </div>
    </div>

    <button type="submit" class="btn" disabled={add_staff.pending > 0}>
      {#if add_staff.pending > 0}
        <i class="icon-[mdi--loading] animate-spin"></i>
        <span>Saving...</span>
      {:else}
        <i class="icon-[mdi--content-save]"></i>
        <span>Save Profile</span>
      {/if}
    </button>
  </form>
</section>

<script lang="ts">
  import { Select } from "melt/components";
  import { toast } from "svelte-sonner";
  import { employment_types, permissions, staff_roles } from "$lib/constants";
  import { format_permissions } from "$lib/utils";
  import { add_staff } from "../staff.remote";
  import { page } from "$app/state";

  let role: (typeof staff_roles)[number] = $state("staff");
  let employee_type: (typeof employment_types)[number] = $state("full-time");

  let staff_id = $state("");

  $effect(() => {
    if (add_staff.result?.message) {
      toast.info(add_staff.result.message);
    }
  });

  $inspect(add_staff.issues);

  /** generate a random staff id */
  function generate_staff_id() {
    staff_id = Math.random().toString(36).substring(2, 15).toUpperCase();
  }
</script>

<section class="max-w-6xl">
  <form {...add_staff}>
    <h2 class="mb-6 text-xl">Add new staff</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <input type="hidden" value={page.params.school_id} name="school_id" />
      <input type="hidden" bind:value={role} name="role" />
      <input type="hidden" bind:value={employee_type} name="employee_type" />

      <div class="flex flex-col space-y-2">
        <label for="first_name" class="label text-gray-500">First Name</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          placeholder="John"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="middle_name" class="label text-gray-500">Middle Name</label>
        <input
          id="middle_name"
          type="text"
          name="middle_name"
          placeholder=""
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="last_name" class="label text-gray-500">Last Name</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          placeholder="Doe"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="staff_id" class="label text-gray-500">Staff ID</label>
        <div class="flex items-center gap-x-3">
          <input
            id="staff_id"
            type="text"
            name="staff_id"
            bind:value={staff_id}
            placeholder=""
            class="input"
          />

          <button type="button" class="btn-sm" onclick={generate_staff_id}>
            <i class="icon-[mdi--rotate-clockwise]"></i>
            <span class="sr-only text-xs">generate</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="email" class="label text-gray-500">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="johndoe@acme.com"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="employed_on" class="label text-gray-500">
          Employed Date
        </label>
        <input id="employed_on" type="date" name="employed_on" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="address" class="label text-gray-500">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          placeholder="2 Wise lane"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="phone_number" class="label text-gray-500">
          Phone Number
        </label>
        <input
          id="phone_number"
          type="tel"
          name="phone_number"
          placeholder="+232-99-456-890"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="password" class="label text-gray-500">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          class="input"
          required
        />
      </div>

      <div>
        <Select bind:value={role}>
          {#snippet children(select)}
            <label
              for={select.ids.trigger}
              class="label mb-2 text-sm text-gray-500"
            >
              Role
            </label>
            <button
              {...select.trigger}
              class="btn-outline w-full justify-between capitalize"
            >
              {select.value || "Select role"}
              <i class="icon-[lucide--chevron-down] size-5"></i>
            </button>

            <div
              {...select.content}
              class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none"
            >
              {#each staff_roles as role}
                <p
                  {...select.getOption(role, role)}
                  class="{role === select.value &&
                    'bg-gray-100'} p-2 hover:bg-gray-100 capitalize"
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
            <label
              for={select.ids.trigger}
              class="label mb-2 text-sm text-gray-500"
            >
              Employment Type
            </label>
            <button
              {...select.trigger}
              class="btn-outline w-full justify-between capitalize"
            >
              {select.value || "Select employment type"}
              <i class="icon-[lucide--chevron-down] size-5"></i>
            </button>

            <div
              {...select.content}
              class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none"
            >
              {#each employment_types as emp_type}
                <p
                  {...select.getOption(emp_type, emp_type)}
                  class="{emp_type === select.value &&
                    'bg-gray-100'} p-2 hover:bg-gray-100 capitalize"
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
          {#each permissions as permission}
            <label class="label capitalize flex items-center text-gray-600">
              <input
                type="checkbox"
                value={permission}
                name="permissions[]"
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

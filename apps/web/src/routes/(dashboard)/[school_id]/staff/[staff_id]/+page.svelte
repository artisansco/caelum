<script lang="ts">
  import { Avatar, Select } from "melt/components";
  import type { PageProps } from "./$types";
  import { format } from "@formkit/tempo";
  import { permissions } from "$lib/constants";
  import { format_permissions, get_status_pill } from "$lib/utils";
  import { delete_staff, update_staff } from "../staff.remote";
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";

  const { data }: PageProps = $props();
  const staff = data.staff;

  let role = $state(staff.role);
  let status = $state(staff.status || "active");
  let edit_mode = $state(false);
  let view_password = $state(false);

  $effect(() => {
    if (update_staff.result?.message) {
      toast.info(update_staff.result.message);
    }
  });
</script>

<div class="max-w-7xl px-6 py-8">
  <!-- Header Section -->
  <header class="mb-8">
    <nav class="mb-4">
      <a
        href="./"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <i class="icon-[mdi--arrow-left] mr-2"></i>
        Back to Staff
      </a>
    </nav>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Avatar src={staff.avatar_url || `https://robohash.org/${staff.email}`}>
          {#snippet children(avatar)}
            <img
              {...avatar.image}
              alt={staff.first_name}
              class="size-20 rounded-full object-cover border"
            />
            <span
              {...avatar.fallback}
              class="size-20 rounded-full text-gray-500 grid place-content-center border"
            >
              {staff.first_name[0]}{staff.last_name[0]}
            </span>
          {/snippet}
        </Avatar>

        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {staff.first_name}
            {staff.middle_name}
            {staff.last_name}
          </h1>
          <div class="mt-1 flex items-center gap-4">
            <p class="text-gray-600 capitalize">{staff.role}:</p>
            <p class="text-gray-600 font-semibold flex items-center gap-1">
              <i class="icon-[mdi--tag] size-4"></i>
              {staff.staff_id}
            </p>
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-medium {get_status_pill(
                staff.status,
              )}"
            >
              {staff.status || "active"}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if edit_mode}
          {#if update_staff.pending === 0}
            <button
              type="button"
              onclick={() => (edit_mode = !edit_mode)}
              class="btn-destructive btn-sm flex items-center gap-2"
            >
              <i class="icon-[mdi--close]"></i>
              Cancel
            </button>
          {/if}
          <button
            type="submit"
            form="edit_details"
            disabled={update_staff.pending > 0}
            class="btn-sm flex items-center gap-2"
          >
            {#if update_staff.pending > 0}
              <i class="icon-[mdi--loading] animate-spin"></i>
              Saving...
            {:else}
              <i class="icon-[mdi--check]"></i>
              Save Changes
            {/if}
          </button>
        {:else}
          <button
            type="button"
            onclick={() => (edit_mode = !edit_mode)}
            class="btn-sm flex items-center gap-2"
          >
            <i class="icon-[mdi--pencil]"></i>
            Edit
          </button>
          <form {...delete_staff}>
            <input
              type="hidden"
              name="staff_id"
              value={page.params?.staff_id}
            />
            <button
              type="submit"
              class="btn-destructive btn-sm flex items-center gap-2"
            >
              <i class="icon-[mdi--trash]"></i>
              Delete
            </button>
          </form>
        {/if}
      </div>
    </div>
  </header>

  <form
    id="edit_details"
    {...update_staff.enhance(async ({ data, submit }) => {
      data.append("role", role);
      data.append("status", status);
      data.append("staff_id", String(page.params?.staff_id));
      data.append("school_id", String(page.params?.school_id));

      if (String(data.get("password")).trim() === "") {
        data.delete("password");
      }

      await submit();
      edit_mode = false;
    })}
  >
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left Column - Main Information -->
      <section class="lg:col-span-2">
        <div class="space-y-6">
          <!-- Personal Information -->
          <article
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <header class="mb-6 flex items-center gap-3">
              <i class="icon-[mdi--account] size-6 bg-blue-500"></i>
              <h2 class="text-lg font-bold text-gray-700">
                Personal Information
              </h2>
            </header>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="flex flex-col space-y-2">
                <label for="first_name" class="label text-sm text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  defaultValue={staff.first_name}
                  disabled={!edit_mode}
                  required
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="middle_name" class="label text-sm text-gray-500">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  defaultValue={staff.middle_name}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="last_name" class="label text-sm text-gray-500">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  defaultValue={staff.last_name}
                  disabled={!edit_mode}
                  required
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="email" class="label text-sm text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={staff.email}
                  disabled={!edit_mode}
                  required
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="phone_number" class="label text-sm text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  defaultValue={staff.contact || ""}
                  disabled={!edit_mode}
                  required
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="address" class="label text-sm text-gray-500">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={staff.address || ""}
                  disabled={!edit_mode}
                  required
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>
            </div>
          </article>

          <!-- Employment Details -->
          <article
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <header class="mb-6 flex items-center gap-3">
              <i class="icon-[mdi--briefcase] size-6 bg-green-600"></i>
              <h2 class="text-lg font-bold text-gray-900">
                Employment Details
              </h2>
            </header>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      disabled={!edit_mode}
                      class="btn-outline capitalize {edit_mode
                        ? 'flex items-center w-full justify-between'
                        : 'border-0 px-0 font-bold'}"
                    >
                      {select.value || "Select role"}
                      {#if edit_mode}
                        <i class="icon-[lucide--chevron-down] size-5"></i>
                      {/if}
                    </button>

                    <div
                      {...select.content}
                      class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none"
                    >
                      {#each ["staff", "admin"] as role}
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
                <Select bind:value={status}>
                  {#snippet children(select)}
                    <label
                      for={select.ids.trigger}
                      class="label mb-2 text-sm text-gray-500"
                    >
                      Status
                    </label>
                    <button
                      {...select.trigger}
                      disabled={!edit_mode}
                      class="btn-outline capitalize {edit_mode
                        ? 'flex items-center w-full justify-between'
                        : 'border-0 px-0 font-bold'}"
                    >
                      {select.value || "Select status"}
                      {#if edit_mode}
                        <i class="icon-[lucide--chevron-down] size-5"></i>
                      {/if}
                    </button>

                    <div
                      {...select.content}
                      class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none"
                    >
                      {#each ["active", "on leave", "retired", "resigned", "suspended"] as status}
                        <p
                          {...select.getOption(status, status)}
                          class="{status === select.value &&
                            'bg-gray-100'} p-2 hover:bg-gray-100 capitalize"
                        >
                          {status}
                        </p>
                      {/each}
                    </div>
                  {/snippet}
                </Select>
              </div>

              <div class="flex flex-col space-y-2">
                <span class="label text-sm text-gray-500"> Employed Date </span>
                <p class="font-bold text-gray-600">
                  {format({
                    date: staff.employed_date,
                    format: "MMM DD, YYYY",
                  })}
                </p>
              </div>

              <div class="flex flex-col space-y-2">
                <label for="password" class="label text-sm text-gray-500">
                  Password
                </label>
                <div class="flex items-center gap-1">
                  <input
                    type={view_password ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="********"
                    disabled={!edit_mode}
                    class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                  />
                  {#if edit_mode}
                    <button
                      type="button"
                      onclick={() => (view_password = !view_password)}
                      class="btn-sm"
                    >
                      {#if view_password}
                        <i class="icon-[mdi--eye-off] size-4"></i>
                      {:else}
                        <i class="icon-[mdi--eye] size-4"></i>
                      {/if}
                      <span class="sr-only">view</span>
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </article>

          <!-- System Permissions -->
          <article
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <header class="mb-6 flex items-center gap-3">
              <i class="icon-[mdi--shield-account] size-6 bg-purple-600"></i>
              <h2 class="text-xl font-bold text-gray-900">
                System Permissions
              </h2>
            </header>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              {#each permissions as permission}
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id={permission}
                    name="permissions"
                    value={permission}
                    checked={staff.permissions.includes(permission)}
                    disabled={!edit_mode}
                    class="checkbox rounded {edit_mode
                      ? 'border-gray-300'
                      : 'border-gray-100'}"
                  />
                  <label
                    for={permission}
                    class="label ml-3 text-sm text-gray-700 capitalize"
                  >
                    <span
                      class="rounded bg-gray-100 px-2 py-1 font-mono text-xs"
                    >
                      {format_permissions(permission)}
                    </span>
                  </label>
                </div>
              {/each}
            </div>
          </article>
        </div>
      </section>

      <!-- Right Column - Additional Information -->
      <aside class="space-y-6">
        <!-- Additional Notes -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <header class="mb-6 flex items-center gap-3">
            <i class="icon-[mdi--note-text] size-6 text-gray-600"></i>
            <h3 class="text-lg font-bold text-gray-900">Additional Notes</h3>
          </header>

          <textarea
            class="textarea cursor-text resize-none border-0 p-0"
            readonly
            disabled
            defaultValue="Excellent communication skills and great relationship with the pupils. Speaks fluent English."
          ></textarea>
        </section>
      </aside>
    </div>
  </form>
</div>

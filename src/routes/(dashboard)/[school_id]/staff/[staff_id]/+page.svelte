<script lang="ts">
  import { Avatar, Select } from "melt/components";
  import { format } from "@formkit/tempo";
  import {
    permissions as staff_permissions,
    staff_roles,
    staff_statuses,
  } from "$lib/constants";
  import { format_permissions, get_status_pill } from "$lib/utils";
  import { delete_staff, get_staff_by_id, update_staff } from "../staff.remote";
  import { toast } from "svelte-sonner";
  import Dialog from "$lib/components/dialog.svelte";
  import { melt } from "@melt-ui/svelte";

  const { params } = $props();

  const {
    address,
    email,
    first_name,
    last_name,
    middle_name,
    password,
    permissions,
    phone_number,
  } = update_staff.fields;

  const staff = $derived(await get_staff_by_id(params.staff_id));
  let role = $derived(staff.role);
  let status = $derived(staff.status);
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
      <a href="./" class="btn-sm-ghost">
        <i class="icon-[mdi--arrow-left]"></i>
        Back to Staff
      </a>
    </nav>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Avatar src={String(staff.avatar_url)}>
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
              {staff.first_name?.at(0)}{staff.last_name?.at(0)}
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
            <p class="btn-sm-ghost">
              <i class="icon-[mdi--tag] size-4"></i>
              {staff.staff_id}
            </p>
            <span class={get_status_pill(String(staff.status))}>
              {staff.status}
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
              class="btn-sm-destructive"
            >
              <i class="icon-[mdi--close]"></i>
              Cancel
            </button>
          {/if}
          <button
            type="submit"
            form="edit_details"
            disabled={update_staff.pending > 0}
            class="btn-sm"
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
            class="btn-sm"
          >
            <i class="icon-[mdi--pencil]"></i>
            Edit
          </button>
          <Dialog label="Dialog Title" outside_close={false}>
            {#snippet trigger_btn($trigger: any)}
              <button use:melt={$trigger} class="btn-sm-destructive">
                <i class="icon-[mdi--trash] size-4"></i>
                Delete
              </button>
            {/snippet}

            <p class="mb-5 mt-2 leading-normal text-zinc-600">
              This action cannot be undone. This will permanently delete the
              staff and remove it from our servers.
            </p>
            <button
              type="button"
              class="btn-destructive w-full"
              onclick={async () => {
                await delete_staff(staff.id);
                toast.success("Staff deleted successfully");
                window.location.href = "./";
              }}
            >
              <i class="icon-[mdi--trash]"></i>
              Confirm Delete
            </button>
          </Dialog>
        {/if}
      </div>
    </div>
  </header>

  <form id="edit_details" {...update_staff}>
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

            <input type="hidden" name="role" bind:value={role} />
            <input type="hidden" name="status" bind:value={status} />
            <input type="hidden" name="staff_id" value={params.staff_id} />
            <input type="hidden" name="school_id" value={params.school_id} />

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="flex flex-col space-y-2">
                <label for="first_name" class="label text-sm text-gray-500">
                  First Name
                </label>
                <input
                  {...first_name.as("text")}
                  type="text"
                  value={staff.first_name}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="middle_name" class="label text-sm text-gray-500">
                  Middle Name
                </label>
                <input
                  {...middle_name.as("text")}
                  type="text"
                  value={staff.middle_name || ""}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="last_name" class="label text-sm text-gray-500">
                  Last Name
                </label>
                <input
                  {...last_name.as("text")}
                  type="text"
                  value={staff.last_name}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="email" class="label text-sm text-gray-500">
                  Email
                </label>
                <input
                  {...email.as("email")}
                  type="email"
                  value={staff.email}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="phone_number" class="label text-sm text-gray-700">
                  Phone Number
                </label>
                <input
                  {...phone_number.as("tel")}
                  type="tel"
                  value={staff.contact}
                  disabled={!edit_mode}
                  class="input {edit_mode ? '' : 'border-0 px-0 font-bold'}"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label for="address" class="label text-sm text-gray-500">
                  Address
                </label>
                <input
                  {...address.as("text")}
                  type="text"
                  value={staff.address}
                  disabled={!edit_mode}
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
                        ? 'w-full justify-between'
                        : 'border-0 px-0 font-bold'}"
                    >
                      {select.value || "Select role"}
                      {#if edit_mode}
                        <i class="icon-[lucide--chevron-down]"></i>
                      {/if}
                    </button>

                    <div
                      {...select.content}
                      class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
                    >
                      {#each staff_roles as role}
                        <p
                          {...select.getOption(role, role)}
                          class="{role === select.value &&
                            'bg-gray-100'} btn-sm-ghost justify-start w-full capitalize"
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
                        ? 'w-full justify-between'
                        : 'border-0 px-0 font-bold'}"
                    >
                      {select.value || "Select status"}
                      {#if edit_mode}
                        <i class="icon-[lucide--chevron-down]"></i>
                      {/if}
                    </button>

                    <div
                      {...select.content}
                      class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
                    >
                      {#each staff_statuses as status}
                        <p
                          {...select.getOption(status, status)}
                          class="{status === select.value &&
                            'bg-gray-100'} btn-sm-ghost justify-start w-full capitalize"
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
                    {...password.as("password")}
                    type={view_password ? "text" : "password"}
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
                      <i
                        class={view_password
                          ? "icon-[mdi--eye-off]"
                          : "icon-[mdi--eye]"}
                      ></i>
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
              {#each staff_permissions as permission}
                <label class="label ml-3 text-sm text-gray-700 capitalize">
                  <input
                    {...permissions.as("checkbox", permission)}
                    type="checkbox"
                    checked={staff.permissions?.includes(permission)}
                    disabled={!edit_mode}
                    class="checkbox rounded {edit_mode
                      ? 'border-gray-300'
                      : 'border-gray-100'}"
                  />
                  <span class="rounded bg-gray-100 p-2 font-mono text-xs">
                    {format_permissions(permission)}
                  </span>
                </label>
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

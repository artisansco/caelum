<script lang="ts">
  import { Avatar, Select } from "melt/components";
  import { toast } from "svelte-sonner";
  import { cities } from "$lib/constants";
  import { format } from "@formkit/tempo";
  import { get_school, update_school } from "../../school.remote";

  const { params } = $props();

  const school = $derived(await get_school(params.school_id));
  let city = $derived(school.city);
  let edit_mode = $state(false);

  $effect(() => {
    if (update_school.result?.message) {
      toast.info(update_school.result.message);
    }
  });
</script>

<section class="max-w-4xl p-6">
  <!-- Header Section -->
  <header class="mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Avatar src={school.logo_url}>
          {#snippet children(avatar)}
            <img
              {...avatar.image}
              alt={school.name}
              class="size-30 rounded object-cover border border-gray-200"
            />
            <div
              {...avatar.fallback}
              class="size-20 rounded-full bg-gray-100 text-gray-600 grid place-content-center border-2 border-gray-200 text-lg font-semibold"
            >
              {school.name?.at(0)?.toUpperCase()}
            </div>
          {/snippet}
        </Avatar>

        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {school.name}
          </h1>
          <p class="text-gray-600 text-sm">
            Founded on {format({
              date: school.founded_on as Date,
              format: "MMMM DD, YYYY",
            })}
          </p>
          <!-- <button type="button" class="btn-sm">change logo</button> -->
        </div>
      </div>

      <div class="flex items-center gap-3">
        {#if edit_mode}
          {#if update_school.pending === 0}
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
            form="school_details"
            disabled={update_school.pending > 0}
            class="btn-sm"
          >
            {#if update_school.pending > 0}
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
            Edit Details
          </button>
        {/if}
      </div>
    </div>
  </header>

  <form
    id="school_details"
    {...update_school.enhance(async ({ form, submit }) => {
      await submit();
      form.reset();
    })}
  >
    <input type="hidden" name="city" bind:value={city} />
    <input type="hidden" name="school_id" value={params.school_id} />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Main Information -->
      <section>
        <article
          class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <header class="mb-6 flex items-center gap-3">
            <i class="icon-[mdi--school] size-6 text-blue-600"></i>
            <h2 class="text-lg font-semibold text-gray-900">
              School Information
            </h2>
          </header>

          <div class="space-y-6">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                School Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={school.name}
                disabled={!edit_mode}
                required
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
              <p class="text-xs text-red-500 mt-1">
                {update_school.issues?.name?.at(0)?.message}
              </p>
            </div>

            <div>
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Address <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={school.address}
                disabled={!edit_mode}
                required
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
              <p class="text-xs text-red-500 mt-1">
                {update_school.issues?.address?.at(0)?.message}
              </p>
            </div>

            <div>
              <Select bind:value={city}>
                {#snippet children(select)}
                  <label
                    for={select.ids.trigger}
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City <span class="text-red-500">*</span>
                  </label>
                  <button
                    {...select.trigger}
                    disabled={!edit_mode}
                    class="btn-outline w-full justify-between capitalize {edit_mode
                      ? 'flex items-center'
                      : 'border-0 px-0 font-semibold bg-transparent hover:bg-transparent focus:ring-0 justify-start'}"
                  >
                    {select.value || "Select City"}
                    {#if edit_mode}
                      <i class="icon-[lucide--chevron-down] size-5"></i>
                    {/if}
                  </button>

                  <div
                    {...select.content}
                    class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none bg-white shadow-lg z-50"
                  >
                    {#each cities as city}
                      <p
                        {...select.getOption(city, city)}
                        class="{city === select.value &&
                          'bg-blue-50 text-blue-900'} p-2 hover:bg-gray-50 capitalize cursor-pointer"
                      >
                        {city}
                      </p>
                    {/each}
                  </div>
                {/snippet}
              </Select>
              <p class="text-xs text-red-500 mt-1">
                {update_school.issues?.city?.at(0)?.message}
              </p>
            </div>

            <div>
              <label
                for="license"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                License Number <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="license"
                name="license"
                defaultValue={school.license}
                disabled={!edit_mode}
                required
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
              <p class="text-xs text-red-500 mt-1">
                {update_school.issues?.license?.at(0)?.message}
              </p>
            </div>
          </div>
        </article>
      </section>

      <!-- Logo and Additional Settings -->
      <section class="space-y-6">
        <!-- Contact Information -->
        <article
          class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <header class="mb-6 flex items-center gap-3">
            <i class="icon-[mdi--contacts] size-6 text-orange-600"></i>
            <h3 class="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
          </header>

          <div class="space-y-4">
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={school.contact}
                disabled={!edit_mode}
                placeholder="+232XXXXXXXX"
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Official Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={school.email}
                disabled={!edit_mode}
                placeholder="info@school.edu"
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
            </div>

            <div>
              <label
                for="website"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                defaultValue={school.website || ""}
                disabled={!edit_mode}
                placeholder="https://www.school.edu"
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
            </div>

            <div>
              <label
                for="website"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Founded on
              </label>
              <input
                type="date"
                id="founded_on"
                name="founded_on"
                defaultValue={school.founded_on}
                disabled={!edit_mode}
                class="input {edit_mode
                  ? ''
                  : 'border-0 px-0 font-semibold bg-transparent focus:ring-0'}"
              />
            </div>
          </div>
        </article>
      </section>
    </div>
  </form>
</section>

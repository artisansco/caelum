<script lang="ts">
import { Select } from "melt/components";
import { toast } from "svelte-sonner";
import { cities } from "$lib/constants";
import { register } from "./register.remote";

const city = $state("");
const field_errors = $derived(register.result?.errors);

$effect(() => {
	if (register.result?.message) {
		toast.error(register.result.message);
	}
});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
  <!-- Header -->
  <div class="bg-white shadow-sm">
    <div class="mx-auto max-w-4xl px-6 py-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900">Register School</h1>
      <p class="mt-2 text-gray-600">
        Register your school to get started with Galexa
      </p>
    </div>
  </div>

  <!-- Form -->
  <div class="mx-auto max-w-4xl px-6 py-8">
    <div class="rounded-2xl bg-white p-8 shadow-lg">
      <form
        {...register.enhance(async ({ data, submit }) => {
          data.append("city", city);
          await submit();
        })}
      >
        <div class="space-y-8">
          <!-- School Information -->
          <fieldset class="space-y-6 [&_input]:placeholder:text-xs">
            <legend class="mb-6 text-xl font-semibold text-gray-900">
              School Information
            </legend>

            <div class="grid gap-6">
              <div class="">
                <label for="name" class="label mb-2 text-sm text-gray-700">
                  School Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  class="input w-full border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter your business name"
                  required
                />
                <span class="text-xs text-red-500">
                  {field_errors?.name?.errors.at(0)}
                </span>
              </div>

              <div>
                <label for="address" class="label mb-2 text-sm text-gray-700">
                  Address *
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  class="input w-full border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your business address"
                  required
                />
                <span class="text-xs text-red-500">
                  {field_errors?.address?.errors.at(0)}
                </span>
              </div>

              <Select bind:value={city}>
                {#snippet children(select)}
                  <label
                    for={select.ids.trigger}
                    class="label -mb-4 text-sm text-gray-700"
                  >
                    City *
                  </label>
                  <button
                    {...select.trigger}
                    class="mb-0 flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-sm"
                  >
                    {select.value || "Select city"}
                    <i class="icon-[lucide--chevron-down] size-5"></i>
                  </button>
                  <span class="-mt-5 text-xs italic text-red-500">
                    {field_errors?.city?.errors.at(0)}
                  </span>

                  <div
                    {...select.content}
                    class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {#each cities as city}
                      <div
                        {...select.getOption(city, city)}
                        class="{city === select.value &&
                          'bg-gray-100'} px-3 py-1 hover:bg-gray-100"
                      >
                        {city}
                      </div>
                    {/each}
                  </div>
                {/snippet}
              </Select>

              <div class="-mt-3">
                <label for="license" class="label mb-2 text-sm text-gray-700">
                  License Number *
                  <span class="font-normal text-gray-500">(if applicable)</span>
                </label>
                <input
                  id="license"
                  type="text"
                  name="license"
                  class="input w-full border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter license number"
                  required
                />
                <span class="text-xs text-red-500">
                  {field_errors?.license?.errors.at(0)}
                </span>
              </div>
            </div>
          </fieldset>

          <!-- Legal & Compliance -->
          <fieldset class="space-y-6">
            <legend class="mb-2 text-xl font-semibold text-gray-900">
              School Owner/Manager
            </legend>

            <div>
              <label for="email" class="label mb-2 text-sm text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                class="input w-full border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter email"
                required
              />
              <span class="text-xs text-red-500">
                {field_errors?.email?.errors.at(0)}
              </span>
            </div>

            <div>
              <label for="password" class="label mb-2 text-sm text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                class="input w-full border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter password"
                required
              />
              <span class="text-xs text-red-500">
                {field_errors?.password?.errors.at(0)}
              </span>
            </div>
          </fieldset>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 flex justify-between items-center">
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="icon-[mdi--information]"></i>
            I confirm that my school is properly verified
          </p>

          <button
            type="submit"
            class="btn flex items-center gap-2"
            disabled={register.pending > 0}
          >
            {#if register.pending > 0}
              <i class="icon-[mdi--loading] size-5 animate-spin"></i>
              Completing Registration...
            {:else}
              <i class="icon-[mdi--check-circle]"></i>
              Complete Registration
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

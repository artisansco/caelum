<script lang="ts">
  import { Select } from "melt/components";
  import { toast } from "svelte-sonner";
  import { cities } from "$lib/constants";
  import { register } from "../auth.remote";
  import { get_field_error } from "$lib/utils";

  const { address, city, email, license, name, password, contact } = register.fields;

  let selected_city = $state("");

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
      <p class="mt-2 text-gray-600">Register your school to get started with Galexa</p>
    </div>
  </div>

  <!-- Form -->
  <div class="mx-auto max-w-4xl px-6 py-8">
    <div class="rounded-2xl bg-white p-8 shadow-lg">
      <form {...register.enhance(async ({ submit }) => await submit())}>
        <div class="space-y-8 [&_input]:w-full">
          <!-- School Information -->
          <fieldset class="space-y-6 [&_input]:placeholder:text-xs">
            <legend class="mb-6 text-xl font-semibold text-gray-900"> School Information </legend>

            <input type="hidden" name="city" bind:value={selected_city} />
            <div class="grid gap-6">
              <div class="">
                <label for="name" class="label mb-2 text-sm text-gray-700"> School Name * </label>
                <input {...name.as("text")} type="text" class="input" />
                <span class="text-xs text-red-500">
                  {get_field_error(name)}
                </span>
              </div>

              <div>
                <label for="address" class="label mb-2 text-sm text-gray-700"> Address * </label>
                <input {...address.as("text")} type="text" class="input" />
                <span class="text-xs text-red-500">
                  {get_field_error(address)}
                </span>
              </div>

              <div>
                <label for="address" class="label mb-2 text-sm text-gray-700">
                  Contact/Phone Number *
                </label>
                <input {...contact.as("tel")} class="input" />
                <span class="text-xs text-red-500">
                  {get_field_error(contact)}
                </span>
              </div>

              <div>
                <Select bind:value={selected_city}>
                  {#snippet children(select)}
                    <label for={select.ids.trigger} class="label mb-2 text-sm text-gray-700">
                      City *
                    </label>
                    <button {...select.trigger} class="btn-outline w-full justify-between mb-2">
                      {select.value || "Select city"}
                      <i class="icon-[lucide--chevron-down]"></i>
                    </button>
                    <span class="text-xs text-red-500">
                      {get_field_error(city)}
                    </span>

                    <div
                      {...select.content}
                      class="max-h-48 w-full rounded-lg border border-gray-300 text-sm"
                    >
                      {#each cities as city}
                        <div
                          {...select.getOption(city, city)}
                          class="{city === select.value &&
                            'bg-gray-100'} btn-sm-ghost w-full justify-start"
                        >
                          {city}
                        </div>
                      {/each}
                    </div>
                  {/snippet}
                </Select>
              </div>

              <div class="-mt-3">
                <label for="license" class="label mb-2 text-sm text-gray-700">
                  License Number *
                  <span class="font-normal text-gray-500">(if applicable)</span>
                </label>
                <input {...license.as("text")} type="text" class="input" />
                <span class="text-xs text-red-500">
                  {get_field_error(license)}
                </span>
              </div>
            </div>
          </fieldset>

          <!-- Legal & Compliance -->
          <fieldset class="space-y-6">
            <legend class="mb-2 text-xl font-semibold text-gray-900"> School Owner/Manager </legend>

            <div>
              <label for="email" class="label mb-2 text-sm text-gray-700"> Email </label>
              <input {...email.as("email")} class="input" />
              <span class="text-xs text-red-500">{get_field_error(email)}</span>
            </div>

            <div>
              <label for="password" class="label mb-2 text-sm text-gray-700"> Password </label>
              <input {...password.as("password")} class="input" />
              <span class="text-xs text-red-500">
                {get_field_error(password)}
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

          <button type="submit" class="btn" disabled={register.pending > 0}>
            {#if register.pending > 0}
              <i class="icon-[mdi--loading] animate-spin"></i>
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

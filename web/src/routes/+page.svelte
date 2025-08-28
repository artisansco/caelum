<script lang="ts">
  import { toast } from "svelte-sonner";
  import { login, google_oauth } from "./auth.remote";

  const field_errors = $derived(login.result?.errors);

  $effect(() => {
    if (login.result?.message) {
      toast.error(login.result.message);
    }
  });
</script>

<section class="font-raleway grid min-h-[100dvh] lg:grid-cols-2">
  <div class="bg-primary grid place-content-center p-4 text-center text-white">
    <h1 class="font-ptsans mb-6 text-5xl font-bold text-white">Galexa</h1>
    <p class="rotate-6 transform rounded bg-slate-600 p-2 shadow md:text-lg">
      Something something galaxy ...
    </p>
  </div>

  <section class="self-center">
    <div class="form grid place-content-center gap-6 p-5">
      <form {...login} class="w-80">
        <header class="mb-5 text-center">
          <h2 class="text-lg font-bold">Login as Staff</h2>
          <p class="text-sm">
            Enter your details below to login to your account
          </p>
        </header>

        <fieldset class="space-y-5">
          <div class="flex flex-col gap-1">
            <label for="" class="label font-medium text-gray-900">Email</label>
            <input
              type="text"
              name="email"
              class="input {field_errors?.email && 'border-red-500'}"
              placeholder="user@acme.com"
              required
            />
            <span class="text-xs text-red-500">
              {field_errors?.email?.errors.at(0)}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <label for="" class="label font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="******"
              class="input {field_errors?.password && 'border-red-500'}"
              required
            />
            <span class="text-xs text-red-500">
              {field_errors?.password?.errors.at(0)}
            </span>
          </div>

          <button type="submit" class="btn" disabled={login.pending > 0}>
            {#if login.pending > 0}
              <i class="icon-[mdi--loading] size-5 animate-spin"></i>
              Loading...
            {:else}
              Login as Staff
            {/if}
          </button>
        </fieldset>
      </form>

      <hr class="my-2 w-full border-2" />

      <div class="grid place-content-center space-y-4">
        <p class="text-center text-sm">
          New School?
          <a href="/register" class="text-blue-500">register now</a>
        </p>
      </div>
    </div>
  </section>
</section>

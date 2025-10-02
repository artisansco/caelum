<script lang="ts">
  import { page } from "$app/state";
  import { get_error_icon, get_error_message } from "$lib/errors";
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
  <div class="text-center max-w-md">
    <!-- Caelum Branding -->
    <h1 class="text-3xl font-bold text-primary mb-8">Caelum</h1>

    <!-- Error Icon -->
    <div class="text-6xl mb-6">{get_error_icon(page.status)}</div>

    <!-- Error Code -->
    <h1 class="text-8xl font-bold text-gray-300 mb-4">{page.status}</h1>

    <!-- Error Message -->
    <p class="text-lg text-gray-600 mb-8">{get_error_message(page.status)}</p>

    <!-- Actions -->
    <div class="flex gap-4 justify-center">
      <button onclick={() => history.back()} class="btn-outline">
        <i class="icon-[mdi--arrow-left]"></i>
        Go Back
      </button>

      <a href="/" class="btn">
        <i class="icon-[mdi--home]"></i>
        Go Home
      </a>
    </div>
  </div>
</div>

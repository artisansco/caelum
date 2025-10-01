<script>
  import { page } from "$app/state";
  import { get_error_icon, get_error_message } from "$lib/errors";
</script>

<div class="flex items-center justify-center min-h-[60vh] p-8">
  <div class="text-center max-w-md">
    <!-- Error Icon -->
    <div class="text-6xl mb-6">{get_error_icon(page.status)}</div>

    <!-- Error Code -->
    <h1 class="text-8xl font-bold text-gray-300 mb-4">{page.status}</h1>

    <!-- Error Message -->
    <p class="text-lg text-gray-600 mb-8">{get_error_message(page.status)}</p>

    <!-- Actions -->
    <button onclick={() => history.back()} class="btn-outline">
      <i class="icon-[mdi--arrow-left]"></i>
      Go Back
    </button>
  </div>
</div>

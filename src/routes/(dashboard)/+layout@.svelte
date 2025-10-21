<script>
  import { afterNavigate } from "$app/navigation";
  import Header from "./header.svelte";
  import Sidebar from "./sidebar.svelte";

  const { children } = $props();

  afterNavigate(() => {
    dialog_state.open = false;
  });
</script>

<div class="min-h-screen bg-white">
  <Header />
  <Sidebar />

  <section class="w-full *:p-4 *:sm:p-6 lg:ps-57 *:lg:p-8">
    {@render children?.()}
  </section>
</div>

<script>
  import AsideMenu from "$lib/components/shared/AsideMenu.svelte";
  import TopNavigation from "$lib/components/shared/TopNavigation.svelte";
</script>

<TopNavigation />
<div class="grid grid-cols-[max-content_1fr]">
  <AsideMenu />
  <main>
    <slot />
  </main>
</div>

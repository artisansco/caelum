<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import favicon from "$lib/assets/favicon.svg";

  // let { children } = $props();
</script>

<slot />

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

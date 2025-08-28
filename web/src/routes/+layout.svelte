<script lang="ts">
  // import "../app.css";
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import favicon from "$lib/assets/favicon.svg";
</script>

<slot />

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

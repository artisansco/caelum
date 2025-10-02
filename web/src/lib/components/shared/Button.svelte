<script>
  import { createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
  export const type = "submit";
  export const classes = "";
  export const disabled = false;
</script>

<button onclick={bubble("click")} {type} {disabled} class="{classes} block">
  {#if children}{@render children()}{:else}Click me{/if}
</button>

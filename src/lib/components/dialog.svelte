<script lang="ts">
  import { createDialog, melt } from "@melt-ui/svelte";
  import type { Snippet } from "svelte";

  let {
    trigger,
    children,
    outside_click = false,
    scroll = true,
    label,
  }: {
    trigger: any;
    children: Snippet;
    outside_click?: boolean;
    scroll?: boolean;
    label: string;
  } = $props();
  const {
    elements: { trigger: dialog_trigger, portalled, overlay, content, title, close },
    states: { open },
  } = createDialog({
    closeOnOutsideClick: outside_click,
    preventScroll: scroll,
  });
</script>

{#if trigger}
  {@render trigger($dialog_trigger)}
{/if}

{#if $open}
  <div use:melt={$portalled}>
    <div use:melt={$overlay} class="fixed inset-0 z-90 bg-black/50"></div>
    <div
      use:melt={$content}
      class="fixed left-1/2 top-1/2 z-90 max-h-[85vh] w-[90vw] max-w-115 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg"
    >
      <h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
        {label}
      </h2>
      {@render children?.()}

      <button
        use:melt={$close}
        aria-label="close"
        class="btn-sm-ghost absolute right-4 top-3 rounded-full p-1"
      >
        <i class="icon-[mdi--close] size-5 bg-red-400 hover:bg-red-700"></i>
      </button>
    </div>
  </div>
{/if}

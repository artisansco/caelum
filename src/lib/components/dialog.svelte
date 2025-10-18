<script lang="ts">
  import { dialog_state } from "$lib/dialog-state.svelte";
  import { createDialog, melt } from "@melt-ui/svelte";
  import type { Snippet } from "svelte";

  let {
    btn_txt = "",
    trigger_class = "btn-sm",
    icon = "",
    children,
    outside_click = false,
    scroll = true,
    label,
  }: {
    btn_txt?: string;
    trigger_class?: string;
    icon?: string;
    children: Snippet;
    outside_click?: boolean;
    scroll?: boolean;
    label: string;
  } = $props();
  const {
    elements: { trigger, portalled, overlay, content, title, close },
    // states: { open }
  } = createDialog({
    closeOnOutsideClick: outside_click,
    preventScroll: scroll,
  });
</script>

<button use:melt={$trigger} class={trigger_class} onclick={() => (dialog_state.open = true)}>
  <i class={icon}></i>
  {btn_txt}
</button>

{#if dialog_state.open}
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
        onclick={() => (dialog_state.open = false)}
      >
        <i class="icon-[mdi--close] size-5 bg-red-400 hover:bg-red-700"></i>
      </button>
    </div>
  </div>
{/if}

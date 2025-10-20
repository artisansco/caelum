<script lang="ts">
  import { Avatar as MeltAvatar } from "melt/components";

  type Props = {
    src: string;
    alt?: string;
    fallback_text?: string;
    shape?: "circle" | "rounded" | "square";
    size?: string;
    class?: string;
    img_class?: string;
  };

  let {
    src,
    alt = "",
    fallback_text = "",
    shape = "circle",
    size = "size-10",
    class: klass = "",
    img_class = "",
  }: Props = $props();

  let shape_class = $derived(() => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "rounded":
        return "rounded-md";
      case "square":
        return "rounded-none";
      default:
        return "rounded-full";
    }
  });
</script>

<MeltAvatar {src}>
  {#snippet children(avatar)}
    <img {...avatar.image} {alt} class="{size} {shape_class} {klass} {img_class}" />
    <span
      {...avatar.fallback}
      class={`text-xs ${size} rounded border-primary grid justify-center items-center ${klass}`}
    >
      {fallback_text}
    </span>
  {/snippet}
</MeltAvatar>

<script>
export const type = "submit";
export const classes = "";
export const disabled = false;
</script>

<button on:click {type} {disabled} class="{classes} block"> <slot>Click me</slot> </button>

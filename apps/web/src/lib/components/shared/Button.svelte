<script>
	export let type = "submit";
	export let classes = "";
	export let disabled = false;
</script>

<button on:click {type} {disabled} class="{classes} block"> <slot>Click me</slot> </button>

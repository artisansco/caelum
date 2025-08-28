<script>
	export let type = "text";
	export let required = true;
	export let value = "";
	export let placeholder = "enter something here";
	export let classes = "";
	export let name = "";
	export let disabled = false;
</script>

<input
	type="{type}"
	required="{required}"
	name="{name}"
	value="{value}"
	disabled="{disabled}"
	on:input="{(event) => (value = event.target.value)}"
	placeholder="{placeholder}"
	class="{classes} block w-full rounded border border-gray-200 p-2 text-sm text-gray-600"
/>

<script>
export const type = "text";
export const required = true;
export const value = "";
export const placeholder = "enter something here";
export const classes = "";
export const name = "";
export const disabled = false;
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

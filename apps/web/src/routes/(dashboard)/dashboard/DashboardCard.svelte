<script>
	import Icon from "@iconify/svelte";

	export let stat = 0;
	export let text = "";
	export let icon = "material-symbols:menu-book-outline-sharp";
</script>

<div class="border rounded bg-gray-50 py-7 px-5 transition-shadow relative hover:shadow-lg">
	<Icon icon="{icon}" class="opacity-20 pl-2 bottom-0 left-0 text-7xl absolute" />
	<h3 class="text-right text-2xl">{stat}</h3>
	<p class="text-right text-sm text-gray-700">{text}</p>
</div>

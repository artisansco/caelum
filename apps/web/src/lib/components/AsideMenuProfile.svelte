<script>
	import { page } from "$app/stores";
	import Icon from "@iconify/svelte";
</script>

<figure class="text-center mb-5">
	<Icon icon="mdi:user" class="mx-auto text-gray-500 text-6.5em block" />
	<!-- <img src="/favicon.png" alt="" class="border rounded-full mx-auto border-gray-400 block" /> -->
	<figcaption>
		<h3 class="font-bold text-2xl text-gray-700">{$page.data.admin.username}</h3>
		<p class="font-light text-sm text-gray-500">{$page.data.admin.email}</p>
	</figcaption>
</figure>

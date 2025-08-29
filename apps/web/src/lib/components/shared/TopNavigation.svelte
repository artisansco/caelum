<script>
	import Button from "./Button.svelte";
</script>

<nav class="bg-white flex shadow min-h-10vh px-5 top-0 sticky items-center justify-between">
	<p>SRMS | Admin</p>

	<form action="/logout" method="post">
		<Button classes="text-red-400 hover:text-red-600">logout</Button>
	</form>
</nav>

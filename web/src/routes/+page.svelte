<script>
	import { enhance, applyAction } from "$app/forms";
	import Button from "../lib/components/shared/Button.svelte";
	import Input from "../lib/components/shared/Input.svelte";

	export let form;
	let validating = false;
</script>

<main class="h-screen bg-gray-100 grid place-content-center">
	<form
		action=""
		method="POST"
		class="bg-white rounded shadow-lg p-5"
		use:enhance={({ form }) => {
			validating = true;
			return async ({ result, update }) => {
				if (result.type === "success") form.reset();
				if (result.type === "invalid") await applyAction(form);
				update();
				validating = false;
			};
		}}
	>
		<legend class="font-bold text-center text-xl">Admin Login</legend>

		<fieldset class="flex flex-col p-10 gap-5">
			<div>
				<label for="">Username</label>
				<Input placeholder="john" name="username" />
			</div>

			<div>
				<label for="">Password</label>
				<Input type="password" placeholder="********" name="password" />
			</div>

			<Button type="submit" classes="text-center w-full text-sm p-2 rounded bg-gray-600 text-white">
				{validating ? "..." : "Login"}
			</Button>

			{#if form?.error}
				<p class="text-xs text-red-500">{form?.error}</p>
			{/if}
		</fieldset>
	</form>
</main>

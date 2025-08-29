<script>
	import { enhance } from "$app/forms";
	import BreadCrumbs from "../../../../lib/components/shared/BreadCrumbs.svelte";
	import Button from "../../../../lib/components/shared/Button.svelte";
	import Input from "../../../../lib/components/shared/Input.svelte";

	export let form;
	export let data;
</script>

<BreadCrumbs>
	<span slot="title">Add Student</span>
</BreadCrumbs>

<form action="" method="post" class="mx-auto max-w-xl mt-10" use:enhance>
	<fieldset class="grid gap-5">
		<div>
			<label for="">Student Name</label>
			<Input name="name" placeholder="John Doe" />
		</div>

		<div>
			<label for="">Student Email</label>
			<Input type="email" name="email" placeholder="johndoe@gmail.com" />
		</div>

		<div>
			<label for="">Gender</label>
			<select
				name="gender"
				class="border rounded border-gray-200 text-sm w-full p-2 text-gray-600 block"
			>
				<option value="Male">Male</option>
				<option value="Female">Female</option>
			</select>
		</div>

		<div>
			<label for="">Date of Birth</label>
			<Input type="date" name="dateOfBirth" />
		</div>

		<div>
			<label for="">Student Class</label>
			<select
				name="classId"
				class="border rounded border-gray-200 text-sm w-full p-2 text-gray-600 block"
			>
				{#await data.streamed.classes}
					<option value="" disabled>--------</option>
				{:then classes}
					<option value=""> - - - - - - - - </option>
					{#each classes as class_ (class_.id)}
						<option value="{class_.id}">{class_.name} {class_?.section ?? ""}</option>
					{/each}
				{/await}
			</select>
		</div>

		{#if form?.error}
			<small class="text-xs text-red-500">{form?.error}</small>
		{/if}

		<Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit">Add Student</Button>
	</fieldset>
</form>

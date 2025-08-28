<script>
	import { enhance } from "$app/forms";
	import Icon from "@iconify/svelte";
	import BreadCrumbs from "../../../../lib/components/shared/BreadCrumbs.svelte";
	import Button from "../../../../lib/components/shared/Button.svelte";
	import Input from "../../../../lib/components/shared/Input.svelte";

	export let data;
	export let form;
	let subjectCode = data.subject.subjectCode;

	const generateCode = () => (subjectCode = crypto.randomUUID().slice(0, 5).toUpperCase());
</script>

<BreadCrumbs>
	<span slot="title">Edit Subject: {data.subject.name} </span>
</BreadCrumbs>

<form action="" method="post" class="mx-auto max-w-xl mt-10" use:enhance>
	<fieldset class="grid gap-5">
		<Input type="hidden" name="id" value="{data.subject.id}" />
		<div>
			<label for="">Subject Name</label>
			<Input name="subject_name" placeholder="Eg:- Java" value="{data.subject.name}" />
		</div>

		<div>
			<label for="" class="flex items-center justify-between">
				Subject Code
				<Button on:click="{generateCode}" type="button">
					<Icon icon="ic:sharp-loop" class="text-2xl text-gray-500 hover:text-blue-500" />
				</Button>
			</label>
			<Input name="subject_code" placeholder="Eg:- 86DD4" bind:value="{subjectCode}" />
		</div>

		<div>
			<label for="">Class</label>
			<select
				name="classId"
				class="border rounded border-gray-200 text-sm w-full p-2 text-gray-600 block"
			>
				{#await data.streamed.classes}
					<option value="" disabled>--------</option>
				{:then classes}
					{#each classes as class_ (class_.id)}
						<option value="{class_.id}" selected="{class_.id === data.subject.classId}">
							{class_.name}
							{class_?.section ?? ""}
						</option>
					{/each}
				{/await}
			</select>
		</div>

		{#if form?.error}
			<small class="text-xs text-red-500">{form?.error}</small>
		{/if}

		<Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit">Update Subject</Button>
	</fieldset>
</form>

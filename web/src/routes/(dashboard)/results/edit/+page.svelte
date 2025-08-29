<script>
	import { enhance } from "$app/forms";
	import dayjs from "dayjs";
	import BreadCrumbs from "../../../../lib/components/shared/BreadCrumbs.svelte";
	import Button from "../../../../lib/components/shared/Button.svelte";
	import Input from "../../../../lib/components/shared/Input.svelte";

	export let data;
	export let form;
</script>

<BreadCrumbs>
	<span slot="title">Edit Student: {data.student.name} - {data.student.roll} </span>
</BreadCrumbs>

<form action="" method="post" class="mx-auto max-w-xl mt-10" use:enhance>
	<fieldset class="grid gap-5">
		<Input type="hidden" name="id" value="{data.student.id}" />

		<div>
			<label for="">Student Name</label>
			<Input name="name" placeholder="John Doe" value="{data.student.name}" />
		</div>

		<div>
			<label for="">Student Email</label>
			<Input type="email" name="email" placeholder="john@gmail.com" value="{data.student.email}" />
		</div>

		<div>
			<label for="">Roll ID</label>
			<Input
				disabled="{true}"
				value="{data.student.roll}"
				classes="disabled:cursor-not-allowed tracking-0.2 font-bold"
			/>
		</div>

		<div>
			<label for="">Registered On</label>
			<Input
				disabled="{true}"
				value="{dayjs(data.student.dateRegistered).format('MMMM DD, YYYY')}"
				classes="disabled:cursor-not-allowed"
			/>
		</div>

		<div>
			<label for="">Date of Birth</label>
			<Input
				type="date"
				name="dateOfBirth"
				value="{dayjs(data.student.dateOfBirth).format('YYYY-MM-DD')}"
			/>
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
					<option value=""> - - - - - - - - </option>
					{#each classes as class_ (class_.id)}
						<option value="{class_.id}" selected="{class_.id === data.student.classId}">
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

		<Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit">Update Student</Button>
	</fieldset>
</form>

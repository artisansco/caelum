<script>
	import { enhance } from "$app/forms";
	import BreadCrumbs from "../../../../lib/components/shared/BreadCrumbs.svelte";
	import Button from "../../../../lib/components/shared/Button.svelte";
	import Input from "../../../../lib/components/shared/Input.svelte";

	export let form;
	export let data;

	$: founded = data.classes.find((cls) => cls.id === changedClass);
	let changedClass;
</script>

<BreadCrumbs>
	<span slot="title">Add Result</span>
</BreadCrumbs>

<form
	action=""
	method="post"
	class="mx-auto max-w-xl mt-10"
	enctype="multipart/form-data"
	use:enhance
>
	<fieldset class="grid gap-5">
		<div>
			<label for="">Class</label>
			<select
				name="classId"
				required
				class="border rounded border-gray-200 text-sm w-full p-2 text-gray-600 block"
				on:change="{(e) => (changedClass = e.target.value)}"
			>
				<option value=""> - - - - - - - - </option>
				{#each data.classes as class_ (class_.id)}
					<option value="{class_.id}">{class_.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="">Student</label>
			<select
				name="studentId"
				required
				class="border rounded border-gray-200 text-sm w-full p-2 text-gray-600 block"
			>
				<option value=""> - - - - - - - - </option>
				{#each data.students as student (student.id)}
					<option value="{student.id}">{student.name}</option>
				{/each}
			</select>
		</div>

		<article>
			<h3>Subjects</h3>

			<section class="mt-3 grid gap-5 indent">
				{#each founded?.subjects || [] as subject}
					<div class="flex gap-3 items-center">
						<label for="" class="text-gray-600">{subject.name}</label>
						<Input type="number" name="marks[{subject.name}]" value="{0}" />
					</div>
				{/each}
			</section>
		</article>

		{#if form?.error}
			<small class="text-xs text-red-500">{form?.error}</small>
		{/if}

		<Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit">Declare Result</Button>
	</fieldset>
</form>

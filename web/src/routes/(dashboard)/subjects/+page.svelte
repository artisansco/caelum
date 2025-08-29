<script>
	import { enhance } from "$app/forms";
	import Icon from "@iconify/svelte";
	import dayjs from "dayjs";
	import BreadCrumbs from "../../../lib/components/shared/BreadCrumbs.svelte";
	import Button from "../../../lib/components/shared/Button.svelte";
	import Input from "../../../lib/components/shared/Input.svelte";

	export let data;
</script>

<BreadCrumbs>
	<span slot="title">Manage Subjects</span>
</BreadCrumbs>

<section class="mt-5 p-4">
	<table class="border-collapse w-full table-auto">
		<thead>
			<tr class="border bg-gray-600 text-left text-white">
				<th class="p-2">Subject Name</th>
				<th class="p-2">Subject Code</th>
				<th class="p-2">Last Updated</th>
				<th>Actions</th>
			</tr>
		</thead>

		<tbody>
			{#each data.subjects as subject (subject.id)}
				<tr class="group">
					<td class="border p-2 text-gray-700">{subject.name}</td>
					<td class="border p-2 text-gray-700">{subject.subjectCode}</td>
					<td class="border text-sm p-2 text-gray-700">
						{dayjs(subject.lastUpdated).format("MMM DD, YYYY - HH:mm a")}
					</td>
					<td class="opacity-0 px-2 text-gray-700 items-center group-hover:opacity-100">
						<span class="flex h-full gap-4">
							<a href="/subjects/edit?id={subject.id}">
								<Icon icon="bi:pen-fill" class="text-blue-400" />
							</a>
							<form action="/subjects?/deleteSubject" method="post" use:enhance>
								<Input type="hidden" name="id" value="{subject.id}" />
								<Button><Icon icon="mdi:trash" class="text-red-400" /></Button>
							</form>
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

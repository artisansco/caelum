<script>
	import AsideMenuProfile from "../AsideMenuProfile.svelte";

	const links = [
		{
			category: "Classes",
			subclasses: [
				{ href: "/classes/new", text: "Add Class" },
				{ href: "/classes", text: "Manage Classes" },
			],
		},
		{
			category: "Subjects",
			subclasses: [
				{ href: "/subjects/new", text: "Add Subject" },
				{ href: "/subjects", text: "Manage Subjects" },
			],
		},
		{
			category: "Students",
			subclasses: [
				{ href: "/students/new", text: "Add Student" },
				{ href: "/students", text: "Manage Students" },
			],
		},
		{
			category: "Results",
			subclasses: [
				{ href: "/results/new", text: "Add Result" },
				{ href: "/results", text: "Manage Results" },
			],
		},
	];
</script>

<aside class="h-screen bg-gray-100 py-10 px-5 overflow-y-scroll block">
	<AsideMenuProfile />

	<!-- Dashboard Link -->
	<div class="my-5">
		<h3 class="font-light text-sm mb-2 uppercase">Main Category</h3>
		<a href="/dashboard">Dashboard</a>
	</div>

	<!-- Apperance Link -->
	<div>
		<h3 class="font-light text-sm mb-3 uppercase">Apperance</h3>

		{#each links as { category, subclasses }}
			<details open>
				<summary class="hover:cursor-pointer">{category}</summary>
				<div class="grid py-2 gap-2 indent-4">
					{#each subclasses as { href, text }}
						<a class="block" href="{href}">{text}</a>
					{/each}
				</div>
			</details>
		{/each}
		<!-- <a href="/dashboard">Change Admin Password</a> -->
	</div>
</aside>

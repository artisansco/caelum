<section class="shadow">
	<h1 class="p-5 text-2xl">
		<slot name="title">Dashboard</slot>
	</h1>

	<hr />
	<!-- breadcrumbs link -->
	<slot name="breadcrumbs">
		<a href="/dashboard" class="text-sm w-fit py-3 px-5 text-gray-500 block">Home</a>
	</slot>
</section>

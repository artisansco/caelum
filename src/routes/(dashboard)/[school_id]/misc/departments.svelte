<script>
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { add_department, delete_department, get_departments } from './misc.remote';

	$effect(() => {
		if (add_department.result?.message) {
			toast.info(add_department.result.message);
		}
	});
</script>

<div class="grid grid-cols-[1fr_25rem] gap-8">
	<!-- Table -->
	<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Departments</h3>
			<p class="text-sm text-gray-600 mt-1">
				Manage your school's academic and administrative departments
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="table min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3 text-left">
							<span class="text-xs font-semibold text-gray-700 uppercase"> Department Name </span>
						</th>
						<th scope="col" class="px-6 py-3 text-left">
							<span class="text-xs font-semibold text-gray-700 uppercase"> Code </span>
						</th>
						<th scope="col" class="px-6 py-3 text-left">
							<span class="text-xs font-semibold text-gray-700 uppercase">
								Head of Department
							</span>
						</th>
						<th scope="col" class="px-6 py-3 text-left">
							<span class="text-xs font-semibold text-gray-700 uppercase"> Type </span>
						</th>
						<th scope="col" class="px-6 py-3 text-right">
							<span class="text-xs font-semibold text-gray-700 uppercase"> Actions </span>
						</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200">
					{#each await get_departments(page.params.school_id) as department}
						<tr class="hover:bg-gray-50 transition-colors group">
							<td class="px-6 py-4">
								<div class="flex items-center">
									<div
										class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3"
									>
										<i class="icon-[mdi--domain] text-blue-600 size-5"></i>
									</div>
									<div>
										<div class="text-sm font-medium text-gray-900">
											{department.name}
										</div>
										{#if department.description}
											<div class="text-xs text-gray-500 mt-1">
												{department.description}
											</div>
										{/if}
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
								>
									{department.code || 'N/A'}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">
									{department.head_of_department || 'Not Assigned'}
								</div>
							</td>
							<td class="px-6 py-4">
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  {department.type === 'academic'
										? 'bg-green-100 text-green-800'
										: 'bg-purple-100 text-purple-800'}"
								>
									{department.type || 'Academic'}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								<button
									type="button"
									class="opacity-0 group-hover:opacity-100 transition-opacity btn-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
									onclick={async () => {
										const confirmed = confirm(
											`Are you sure you want to delete "${department.name}" department?`
										);
										if (confirmed) {
											await delete_department({
												school_id: page.params.school_id,
												department_id: department.id
											});
											toast.success('Department deleted successfully');
										}
									}}
								>
									<i class="icon-[mdi--trash] size-4"></i>
									<span class="sr-only">Delete</span>
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center">
								<div class="flex flex-col items-center">
									<i class="icon-[mdi--domain] text-gray-300 text-4xl mb-4"></i>
									<h3 class="text-sm font-medium text-gray-900 mb-2">No Departments</h3>
									<p class="text-sm text-gray-500">Get started by adding your first department.</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Form to add departments -->
	<aside class="bg-white rounded-lg shadow-sm border p-6 h-fit">
		<form {...add_department}>
			<h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
				<i class="icon-[mdi--plus-circle] size-5 mr-2 text-blue-600"></i>
				Add Department
			</h3>

			<fieldset class="space-y-6">
				<input type="hidden" name="school_id" value={page.params.school_id} />

				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Department Name <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Mathematics"
						class="input"
						required
					/>
					<p class="text-xs text-red-500 mt-1">
						{add_department.issues?.name?.at(0)?.message}
					</p>
				</div>

				<div>
					<label for="code" class="block text-sm font-medium text-gray-700 mb-2">
						Department Code
					</label>
					<input
						type="text"
						id="code"
						name="code"
						placeholder="MATH"
						class="input"
						maxlength="10"
					/>
					<p class="text-xs text-gray-500 mt-1">Optional short code for the department</p>
					<p class="text-xs text-red-500 mt-1">
						{add_department.issues?.code?.at(0)?.message}
					</p>
				</div>

				<div>
					<label for="type" class="block text-sm font-medium text-gray-700 mb-2">
						Department Type <span class="text-red-500">*</span>
					</label>
					<select id="type" name="type" class="input" required>
						<option value="">Select Type</option>
						<option value="academic">Academic</option>
						<option value="administrative">Administrative</option>
					</select>
					<p class="text-xs text-red-500 mt-1">
						{add_department.issues?.type?.at(0)?.message}
					</p>
				</div>

				<div>
					<label for="head_of_department" class="block text-sm font-medium text-gray-700 mb-2">
						Head of Department
					</label>
					<input
						type="text"
						id="head_of_department"
						name="head_of_department"
						placeholder="Dr. John Smith"
						class="input"
					/>
					<p class="text-xs text-gray-500 mt-1">Name of the department head (optional)</p>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						placeholder="Brief description of the department..."
						class="textarea resize-none"
					></textarea>
					<p class="text-xs text-gray-500 mt-1">Optional description of the department</p>
				</div>

				<button type="submit" class="btn w-full" disabled={add_department.pending > 0}>
					{#if add_department.pending > 0}
						<i class="icon-[mdi--loading] animate-spin mr-2"></i>
						Adding Department...
					{:else}
						<i class="icon-[mdi--plus] mr-2"></i>
						Add Department
					{/if}
				</button>
			</fieldset>
		</form>
	</aside>
</div>

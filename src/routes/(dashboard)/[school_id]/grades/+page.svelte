<script lang="ts">
	import { get_grades } from './grades.remote';
	import AddNewGrade from './add-grade.svelte';
	import { school_terms } from '$lib/constants';

	let grade_promise = $derived(get_grades());
	const grades = $derived(await grade_promise);

	let show_add_form = $state(false);
	let filter_student = $state('');
	let filter_subject = $state('');
	let filter_term = $state('');
	let filter_academic_year = $state(new Date().getFullYear().toString());

	let filtered_grades = $derived.by(() => {
		let filtered = grades;

		if (filter_student) {
			filtered = filtered.filter(
				(grade) =>
					grade.student_name?.toLowerCase().includes(filter_student.toLowerCase()) ||
					grade.student_last_name?.toLowerCase().includes(filter_student.toLowerCase()) ||
					grade.student_admission_number?.includes(filter_student)
			);
		}

		if (filter_subject) {
			filtered = filtered.filter(
				(grade) =>
					grade.subject_name?.toLowerCase().includes(filter_subject.toLowerCase()) ||
					grade.subject_code?.toLowerCase().includes(filter_subject.toLowerCase())
			);
		}

		if (filter_term) {
			filtered = filtered.filter((grade) => grade.term === filter_term);
		}

		if (filter_academic_year) {
			filtered = filtered.filter((grade) => grade.academic_year === filter_academic_year);
		}

		return filtered;
	});
</script>

<div class="p-6">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Grades</h1>
			<p class="mt-2 text-gray-600">Track and manage student academic performance</p>
		</div>
		<button type="button" onclick={() => (show_add_form = !show_add_form)} class="btn-sm">
			<i class="icon-[mdi--plus]"></i>
			Add Grade
		</button>
	</div>

	<AddNewGrade show_add_grade={show_add_form} />

	<!-- Filters -->
	<div class="bg-white shadow rounded-lg p-4 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
				<label for="filter_student" class="label">Filter by Student</label>
				<input
					id="filter_student"
					bind:value={filter_student}
					type="text"
					class="input"
					placeholder="Student name or admission number"
				/>
			</div>
			<div>
				<label for="filter_subject" class="label">Filter by Subject</label>
				<input
					id="filter_subject"
					bind:value={filter_subject}
					type="text"
					class="input"
					placeholder="Subject name or code"
				/>
			</div>
			<div>
				<label for="filter_term" class="label">Filter by Term</label>
				<select id="filter_term" bind:value={filter_term} class="select">
					<option value="">All Terms</option>
					{#each school_terms as term}
						<option value={term} class="capitalize">{term}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="filter_academic_year" class="label">Academic Year</label>
				<input
					id="filter_academic_year"
					bind:value={filter_academic_year}
					type="text"
					class="input"
				/>
			</div>
		</div>
	</div>

	<!-- Grades Table -->
	<div class="bg-white shadow-lg rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-xl font-semibold">Grades ({grades.length})</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="table min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr class="*:text-gray-500 *:uppercase *:tracking-wider">
						<th class="text-xs">Student</th>
						<th class="text-xs">Subject</th>
						<th class="text-xs">Type</th>
						<th class="text-xs">Grade</th>
						<th class="text-xs">Term/Year</th>
						<th class="text-xs">Graded By</th>
						<th class=""></th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each grades as grade}
						<tr class="hover:bg-gray-50 *:py-3">
							<td class="whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">
									{grade.student_name}
									{grade.student_last_name}
								</div>
								<div class="text-sm text-gray-500">{grade.student_admission_number}</div>
							</td>
							<td class="whitespace-nowrap">
								<div class="text-sm text-gray-900">{grade.subject_name}</div>
								<div class="text-xs text-gray-500">{grade.class_name}</div>
							</td>
							<td class="whitespace-nowrap">
								<span class="badge-secondary">{grade.grade_type}</span>
							</td>
							<td class="whitespace-nowrap text-sm text-gray-900">
								{Math.round(grade.actual_score)} / {Math.round(Number(grade.max_score))}
								<p class="text-xs text-gray-500">
									{Math.round((grade.actual_score / Number(grade.max_score)) * 100)}%
								</p>
							</td>

							<td class="whitespace-nowrap text-sm text-gray-900">
								<div class="capitalize">{grade.term} Term</div>
								<div class="text-xs text-gray-500">{grade.academic_year}</div>
							</td>
							<td class="whitespace-nowrap text-sm text-gray-900">
								{grade.grader_name}
								{grade.grader_last_name}
							</td>
							<td class="whitespace-nowrap text-right text-sm font-medium">
								<div class="flex justify-end space-x-2">
									<button
										type="button"
										onclick={() => alert('TODO: implement edit soon')}
										class="btn-sm"
									>
										<i class="icon-[mdi--pencil]"></i>
										<span class="sr-only">edit</span>
									</button>
									<button
										type="button"
										onclick={() => alert('TODO: implement delete soon')}
										class="btn-sm-destructive"
									>
										<i class="icon-[mdi--trash]"></i>
										<span class="sr-only">delete</span>
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-4 text-center text-gray-500">
								No grades found matching your filters.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

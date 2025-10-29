<script lang="ts">
	import { page } from "$app/stores";
	import {
		export_student_pdf,
		export_student_excel,
	} from "../../exports/exports.remote";

	const { data } = $props();

	let exporting = $state<string | null>(null);

	async function downloadPDF(term: string, academic_year: string) {
		try {
			exporting = `pdf-${term}-${academic_year}`;

			const result = await export_student_pdf({
				student_id: $page.data.student.id,
				term,
				academic_year,
			});

			if (result.success && result.data) {
				// Convert base64 to blob and download
				const binary = atob(result.data.content);
				const array = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					array[i] = binary.charCodeAt(i);
				}
				const blob = new Blob([array], { type: result.data.mime_type });
				const url = URL.createObjectURL(blob);

				const a = document.createElement("a");
				a.href = url;
				a.download = result.data.filename;
				a.click();

				URL.revokeObjectURL(url);
			} else {
				alert("Failed to generate PDF");
			}
		} catch (error) {
			console.error("PDF export error:", error);
			alert("Failed to export PDF");
		} finally {
			exporting = null;
		}
	}

	async function downloadExcel(term: string, academic_year: string) {
		try {
			exporting = `excel-${term}-${academic_year}`;

			const result = await export_student_excel({
				student_id: $page.data.student.id,
				term,
				academic_year,
			});

			if (result.success && result.data) {
				// Convert base64 to blob and download
				const binary = atob(result.data.content);
				const array = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					array[i] = binary.charCodeAt(i);
				}
				const blob = new Blob([array], { type: result.data.mime_type });
				const url = URL.createObjectURL(blob);

				const a = document.createElement("a");
				a.href = url;
				a.download = result.data.filename;
				a.click();

				URL.revokeObjectURL(url);
			} else {
				alert("Failed to generate Excel file");
			}
		} catch (error) {
			console.error("Excel export error:", error);
			alert("Failed to export Excel file");
		} finally {
			exporting = null;
		}
	}
</script>

<div class="space-y-6">
	<div class="bg-white shadow rounded-lg p-6">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">My Academic Results</h2>
		<p class="text-gray-600">
			View and download your results for each term and academic year
		</p>
	</div>

	{#if data.periods.length === 0}
		<div class="bg-white shadow rounded-lg p-12 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
			<p class="mt-1 text-sm text-gray-500">
				Your results will appear here once they are published by your teachers
			</p>
		</div>
	{:else}
		{#each data.periods as period}
			<div class="bg-white shadow rounded-lg overflow-hidden">
				<!-- Period Header -->
				<div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-xl font-bold text-white">
								{period.term} - {period.academic_year}
							</h3>
							<p class="text-indigo-100 text-sm mt-1">
								{period.stats.total_subjects} subjects
							</p>
						</div>
						<div class="text-right">
							<div class="text-3xl font-bold text-white">
								{period.stats.overall_grade}
							</div>
							<div class="text-indigo-100 text-sm">
								{period.stats.average.toFixed(1)}% Average
							</div>
						</div>
					</div>
				</div>

				<!-- Summary Stats -->
				<div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
					<div class="grid grid-cols-3 gap-4">
						<div>
							<p class="text-xs text-gray-500 uppercase">Total Marks</p>
							<p class="text-lg font-semibold text-gray-900">
								{period.stats.total_marks}/{period.stats.max_marks}
							</p>
						</div>
						<div>
							<p class="text-xs text-gray-500 uppercase">Average</p>
							<p class="text-lg font-semibold text-gray-900">
								{period.stats.average.toFixed(2)}%
							</p>
						</div>
						<div>
							<p class="text-xs text-gray-500 uppercase">Overall Grade</p>
							<p class="text-lg font-semibold text-gray-900">
								{period.stats.overall_grade}
							</p>
						</div>
					</div>
				</div>

				<!-- Grades Table -->
				<div class="px-6 py-4">
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th
										class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Subject
									</th>
									<th
										class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Type
									</th>
									<th
										class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Score
									</th>
									<th
										class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Percentage
									</th>
									<th
										class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Grade
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each period.grades as grade}
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 text-sm font-medium text-gray-900">
											{grade.subject_name}
										</td>
										<td class="px-4 py-3 text-sm text-gray-500">
											{grade.grade_type}
										</td>
										<td class="px-4 py-3 text-sm text-gray-900">
											{grade.actual_score}/{grade.max_score}
										</td>
										<td class="px-4 py-3 text-sm text-gray-900">
											{grade.percentage.toFixed(1)}%
										</td>
										<td class="px-4 py-3">
											<span
												class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
												{grade.grade_letter === 'A+' || grade.grade_letter === 'A'
													? 'bg-green-100 text-green-800'
													: grade.grade_letter === 'B'
														? 'bg-blue-100 text-blue-800'
														: grade.grade_letter === 'C'
															? 'bg-yellow-100 text-yellow-800'
															: grade.grade_letter === 'D' || grade.grade_letter === 'E'
																? 'bg-orange-100 text-orange-800'
																: 'bg-red-100 text-red-800'}"
											>
												{grade.grade_letter}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<!-- Export Actions -->
				<div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
					<button
						onclick={() => downloadPDF(period.term, period.academic_year)}
						disabled={exporting !== null}
						class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if exporting === `pdf-${period.term}-${period.academic_year}`}
							<svg
								class="animate-spin -ml-1 mr-2 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Generating...
						{:else}
							<svg
								class="-ml-1 mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
							Download PDF
						{/if}
					</button>

					<button
						onclick={() => downloadExcel(period.term, period.academic_year)}
						disabled={exporting !== null}
						class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if exporting === `excel-${period.term}-${period.academic_year}`}
							<svg
								class="animate-spin -ml-1 mr-2 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Generating...
						{:else}
							<svg
								class="-ml-1 mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							Download Excel
						{/if}
					</button>
				</div>
			</div>
		{/each}
	{/if}
</div>

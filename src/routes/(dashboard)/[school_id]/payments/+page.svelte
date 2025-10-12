<script lang="ts">
	import { Avatar } from 'melt/components';
	import { get_school } from '../../school.remote';
	import { get_payments, get_payment_statistics } from './payments.remote';
	import AddNewPayment from './add-payment.svelte';
	import { format_currency } from '$lib/utils';
	import { format } from '@formkit/tempo';

	const { params } = $props();

	let school_promise = $derived(get_school(params.school_id));
	let statistics_promise = $derived(get_payment_statistics());
	let payments_promise = $derived(get_payments());

	let school = $derived(await school_promise);
	let payments = $derived(await payments_promise);
	let statistics = $derived(await statistics_promise);

	// State for modals and forms
	let show_add_form = $state(false);
	let filter_student = $state('');

	const current_user = $derived({
		name: 'School Admin',
		username: '@admin',
		avatar: school.logo_url || ''
	});
	const subscription = $state({ plan: 'Pro', renewal_date: 'Nov. 2021' });
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<header class="mb-8">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold text-gray-900">Payments</h1>
				<button type="button" onclick={() => (show_add_form = !show_add_form)} class="btn-sm">
					<i class="icon-[mdi--plus]"></i>
					Add Payment
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-8">
				<!-- User Profile Section -->
				<section class="bg-white rounded-lg shadow-sm p-6">
					<div class="flex items-center space-x-4">
						<Avatar src={current_user.avatar}>
							{#snippet children(avatar)}
								<img {...avatar.image} alt={current_user.name} class="size-12 rounded-full" />
								<span
									{...avatar.fallback}
									class="text-lg font-semibold bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"
								>
									{current_user.name[0]}
								</span>
							{/snippet}
						</Avatar>
						<div>
							<h2 class="text-lg font-semibold text-gray-900">{current_user.name}</h2>
							<p class="text-sm text-gray-500">{current_user.username}</p>
						</div>
					</div>
				</section>

				<AddNewPayment show_payment={show_add_form} />

				<!-- Filters -->
				<section class="bg-white rounded-lg shadow-sm p-4">
					<div>
						<label for="filter_student" class="block text-sm font-medium text-gray-700 mb-2">
							Search Student
						</label>
						<input
							id="filter_student"
							bind:value={filter_student}
							type="search"
							placeholder="Name or admission number"
							class="input w-full"
						/>
					</div>
				</section>

				<!-- Order History Section -->
				<section class="bg-white rounded-lg shadow-sm overflow-hidden">
					<div class="px-6 py-4 border-b border-gray-200">
						<div class="flex justify-between items-center">
							<h3 class="text-lg font-semibold text-gray-900">Payments History</h3>
							<p class="text-sm text-gray-500">Manage billing information and view receipts</p>
						</div>
					</div>

					<div class="overflow-x-auto">
						<table class="table min-w-full">
							<thead>
								<tr class="bg-gray-50 *:text-gray-500 *:uppercase *:tracking-wider">
									<th class="text-xs">Student</th>
									<th class="text-xs">Amount</th>
									<th class="text-xs">Type</th>
									<th class="text-xs">Method</th>
									<th class="text-xs">Received by</th>
									<th class="text-xs">Date</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each payments as payment}
									<tr class="hover:bg-gray-50">
										<td class="py-4 px-6">
											<div class="text-sm font-medium text-gray-900">
												{payment.student_name}
												{payment.student_last_name}
											</div>
											<div class="text-sm text-gray-500">
												{payment.student_admission_number}
											</div>
										</td>
										<td class="py-4 px-6 text-sm font-medium text-gray-900">
											{format_currency(payment.amount)}
										</td>
										<td class="py-4 px-6 text-sm text-gray-900">
											{payment.payment_type}
										</td>
										<td class="py-4 px-6">
											{payment.payment_status}
										</td>
										<td class="py-4 px-6">
											{payment.received_by_name}
										</td>
										<td class="py-4 px-6 text-sm text-gray-900">
											{format({ date: payment.created_at, format: 'MMM DD, YYYY' })}
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="6" class="py-8 px-6 text-center text-gray-500">
											No payments found
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			</div>

			<!-- Sidebar -->
			<aside class="lg:col-span-1 space-y-6">
				<!-- Subscription Card -->
				<section class="bg-primary/90 text-white rounded-lg p-6 shadow-sm">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-red-100 mb-2">Your plan</p>
							<h3 class="text-xl font-bold mb-1">{subscription.plan}</h3>
							<p class="text-sm text-red-100 mb-6">
								Ends on {subscription.renewal_date}
							</p>
						</div>
						<i class="block icon-[mdi--clock] text-5xl animate-spin"></i>
					</div>
					<button type="button" class="btn-sm-destructive w-full">Cancel subscription</button>
				</section>

				<!-- Statistics Card -->
				<section class="bg-white rounded-lg shadow-sm p-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-sm text-gray-600">Total Payments</span>
							<span class="text-sm font-medium text-gray-900">{statistics.total_payments}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-600">This Year</span>
							<span class="text-sm font-medium text-green-600">
								{statistics.by_status.completed}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-600">This Month</span>
							<span class="text-sm font-medium text-green-600">
								{statistics.by_status.completed}
							</span>
						</div>

						<div class="flex justify-between border-t pt-4">
							<span class="text-sm font-medium text-gray-900">Total Revenue</span>
							<span class="text-sm font-bold text-gray-900">
								{format_currency(statistics.total_amount)}
							</span>
						</div>
					</div>
				</section>
			</aside>
		</div>
	</div>
</div>

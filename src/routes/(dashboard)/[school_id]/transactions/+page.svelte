<script lang="ts">
	import { format_currency } from '$lib/utils';
	import { get_transactions } from './transactions.remote';

	const { params } = $props();

	let tenant = $derived(params.school_id);
	let transactions_promise = $derived(get_transactions());

	let transactions = $derived(await transactions_promise);

	function get_status_color(status: string) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			case 'refunded':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function get_type_color(type: string) {
		switch (type) {
			case 'subscription':
				return 'bg-blue-100 text-blue-800';
			case 'upgrade':
				return 'bg-green-100 text-green-800';
			case 'addon':
				return 'bg-purple-100 text-purple-800';
			case 'penalty':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="p-6">
	<div class=" mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Transaction History</h1>
		<p class="mt-2 text-gray-600">Track payments to the Caelum platform</p>
	</div>

	<!-- Transactions Table -->
	<div class="bg-white shadow-lg rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-xl font-semibold">Transaction Records ({transactions.length})</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="table min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr class="bg-gray-50 *:text-gray-500 *:uppercase *:tracking-wider">
						<th class="text-xs">Reference</th>
						<th class="text-xs">Amount</th>
						<th class="text-xs">Type</th>
						<th class="text-xs">Method</th>
						<th class="text-xs">Status</th>
						<th class="text-xs">Plan</th>
						<th class="text-xs">Date</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each transactions as transaction}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{transaction.reference_number || 'N/A'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{format_currency(transaction.amount)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="badge {get_type_color(transaction.transaction_type)}">
									{transaction.transaction_type}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{transaction.payment_method.replace('_', ' ')}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="badge {get_status_color(transaction.transaction_status)}">
									{transaction.transaction_status}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{transaction.plan_name || 'Free'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(transaction.created_at).toLocaleDateString()}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="px-6 py-4 text-center text-gray-500">
								No transaction records found.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

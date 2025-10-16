<script lang="ts">
	import { format_currency } from '$lib/utils';
	import { get_transactions } from './transactions.remote';
	import { format } from '@formkit/tempo';

	let transactions_promise = $derived(get_transactions());
	let transactions = $derived(await transactions_promise);

	function get_type_color(type: string) {
		switch (type) {
			case 'subscription':
				return 'bg-blue-100 text-blue-800';
			case 'upgrade':
				return 'bg-green-100 text-green-800';
			default:
				return 'badge-secondary';
		}
	}
</script>

<div class="p-6">
	<div class=" mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Transaction History</h1>
		<p class="mt-2 text-gray-600">Track payments to the Caelum platform</p>
	</div>

	<!-- Transactions Table -->
	<div class="bg-white shadow-lg max-w-7xl rounded-lg">
		<div class="p-4 border-b border-gray-200">
			<h2 class="text-xl font-semibold">Transactions ({transactions.length})</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="table divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr class="bg-gray-50 *:text-gray-500 *:uppercase *:tracking-wider">
						<th class="text-xs">Reference</th>
						<th class="text-xs">Amount</th>
						<th class="text-xs">Type</th>
						<th class="text-xs">Method</th>
						<th class="text-xs">Duration</th>
						<th class="text-xs">Plan</th>
						<th class="text-xs">Date</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each transactions as transaction}
						<tr class="*:whitespace-nowrap *:text-sm">
							<td class="font-medium text-gray-900">
								{transaction?.reference_number || 'N/A'}
							</td>
							<td class="font-medium text-gray-900">
								{format_currency(transaction.amount)}
							</td>
							<td class="whitespace-nowrap">
								<span class="badge {get_type_color(transaction.transaction_type)}">
									{transaction.transaction_type}
								</span>
							</td>
							<td class="text-gray-900 capitalize">
								{transaction.payment_method.replace('_', ' ')}
							</td>
							<td class="whitespace-nowrap">
								<span class="badge-secondary">
									{transaction.plan_name === 'free'
										? 'unlimited'
										: `${transaction.plan_duration} days`}
								</span>
							</td>
							<td class="text-gray-900">{transaction.plan_name}</td>
							<td class="text-gray-500">{format(transaction.created_at, 'MMM DD, YYYY')}</td>
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

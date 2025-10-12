<script lang="ts">
	import { get_faqs, get_plans } from './pricing.remote';
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-3xl font-bold text-gray-900">Choose the Perfect Plan</h1>
			<p class="mt-4 text-gray-600 max-w-3xl mx-auto">
				Scale your school management with plans designed to grow with your institution. From small
				classrooms to large districts, we have you covered.
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-16 mb-16">
			{#each await get_plans() as plan}
				<div class="relative bg-white rounded-2xl shadow-lg border-2 {plan.color}">
					{#if plan.popular}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<span class="bg-gradient-to-r from-purple-500 to-pink-500 badge"> Most Popular </span>
						</div>
					{/if}

					<div class="p-8">
						<!-- Plan Header -->
						<div class="text-center mb-8">
							<h3 class="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
							<div class="mb-4">
								<span class="text-4xl font-bold text-gray-900">
									{plan.price}
								</span>
								<span class="text-gray-600 ml-2">/ {plan.period}</span>
							</div>
							<p class="text-gray-600 text-sm">{plan.description}</p>
						</div>

						<!-- Features List -->
						<div class="mb-8">
							<ul class="space-y-3">
								{#each plan.features as feature}
									<li class="flex items-center gap-2">
										<i class="icon-[lucide--check] text-green-500"></i>
										<span class="text-gray-700 text-sm">{feature}</span>
									</li>
								{/each}
							</ul>
						</div>

						<!-- CTA Button -->
						<button
							type="button"
							onclick={() => console.log(plan.name)}
							class="btn w-full
								{plan.popular &&
								'bg-gradient-to-r from-purple-500 to-pink-500  hover:from-purple-600 hover:to-pink-600'}"
						>
							{plan.button_text}
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- FAQ Section -->
		<div class="max-w-4xl mx-auto">
			<h2 class="text-xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				{#each await get_faqs() as { question, answer }}
					<div class="bg-white rounded-lg p-6 shadow-md">
						<h3 class="font-semibold text-gray-900 mb-3">{question}</h3>
						<p class="text-gray-600 text-sm">{answer}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

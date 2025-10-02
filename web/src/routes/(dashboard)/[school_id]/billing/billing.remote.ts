import { prerender } from "$app/server";

export const get_faqs = prerender(() => {
	const faqs = [
		{
			question: "Can I change plans anytime?",
			answer:
				"Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
		},
		{
			question: "Is my data secure?",
			answer:
				"Absolutely. We use enterprise-grade security with SSL encryption and regular backups to keep your data safe.",
		},
		{
			question: "Do you offer discounts for annual billing?",
			answer: "Yes! Save 20% when you choose annual billing on any paid plan.",
		},
		{
			question: "What happens if I exceed my student limit?",
			answer:
				"We'll notify you before you reach your limit. You can easily upgrade to accommodate more students.",
		},
		// { question: "", answer: "" },
	];

	return faqs;
});

export const get_plans = prerender(() => {
	const plans = [
		{
			name: "Free",
			price: "SLE 0",
			period: "forever",
			description: "Perfect for small schools getting started",
			features: [
				"Up to 20 students",
				"Basic analytics",
				// "Simple attendance",
				"Basic reporting",
				"Custom grade scales",
			],

			button_text: "Get Started",
			popular: false,
			color: "border-gray-200",
		},
		{
			name: "Standard",
			price: "SLE 499",
			period: "per month",
			description: "Complete solution for established schools",
			features: [
				"Everything in Basic plan",
				"Up to 500 students",
				"Phone & email support",
				"Advanced security & compliance",
				"On-site training",
				"Upload Homework assignments",
				"SMS notification",
				// "Fee management & billing",
			],
			button_text: "Upgrade",
			popular: true,
			color: "border-purple-300",
		},
		{
			name: "Basic",
			price: "SLE 199",
			period: "per month",
			description: "Ideal for growing schools with essential needs",
			features: [
				"Everything in Free plan",
				"Up to 150 students",
				"Email notifications",
				"Custom School Logo",
				"Basic customer support",
			],
			button_text: "Upgrade",
			popular: false,
			color: "border-blue-200",
		},
	];

	return plans;
});

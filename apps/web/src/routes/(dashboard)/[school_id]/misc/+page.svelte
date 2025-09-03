<script lang="ts">
// {
// 	category: "Classes",
// 	subclasses: [
// 		{ href: "/classes/new", text: "Add Class" },
// 		{ href: "/classes", text: "Manage Classes" },
// 	],
// },
// {
// 	category: "Subjects",
// 	subclasses: [
// 		{ href: "/subjects/new", text: "Add Subject" },
// 		{ href: "/subjects", text: "Manage Subjects" },
// 	],
// },

const business_types = [
	"hotel",
	"motel",
	"guest-house",
	"bed-breakfast",
	"resort",
	"hostel",
];

// Owner/Manager Information
// name: '',
// email: '',
// phone: '',
// title: '',

// Property Details
// totalRooms: '',
// maxGuests: '',
// amenities: '',
// checkInTime: '',
// checkOutTime: '',

// Legal & Licensing
// businessLicense: '',
// taxId: '',
// insured: false,
// compliance: false,

// Profile data
const businessProfile = {
	name: "",
	description: "",
	address: "",
	phone: "",
	email: "",
	website: "",
	propertyType: "hotel",
	amenities: [],
	checkInTime: "15:00",
	checkOutTime: "11:00",
};

// const propertyTypes = ['hotel', 'motel', 'guest-house', 'bed-breakfast', 'resort', 'hostel'];
const propertyTypes = business_types;
const availableAmenities = [
	"WiFi",
	"Parking",
	"Pool",
	"Gym",
	"Restaurant",
	"Bar",
	"Spa",
	"Pet Friendly",
	"Air Conditioning",
	"Room Service",
];

function saveProfile() {
	console.log("Saving profile...", businessProfile);
	// Implementation for saving profile
}
</script>

<section class="max-w-4xl">
  <h2
    class="mb-6 border-b-2 border-gray-200 pb-2 text-2xl font-semibold text-gray-800"
  >
    Property Profile
  </h2>
  <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
    <div class="flex flex-col">
      <label for="business-name" class="mb-2 text-sm font-medium text-gray-700"
        >Property Name</label
      >
      <input
        id="business-name"
        type="text"
        bind:value={businessProfile.name}
        placeholder="e.g., Grand Oak Hotel"
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col">
      <label for="property-type" class="mb-2 text-sm font-medium text-gray-700"
        >Property Type</label
      >
      <select
        id="property-type"
        bind:value={businessProfile.propertyType}
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      >
        <option value="" disabled selected>Select Property Type</option>
        {#each propertyTypes as type}
          <option value={type}>
            {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </option>
        {/each}
      </select>
    </div>

    <div class="flex flex-col md:col-span-2">
      <label for="description" class="mb-2 text-sm font-medium text-gray-700"
        >Description</label
      >
      <textarea
        id="description"
        bind:value={businessProfile.description}
        placeholder="Describe your property, its unique features, and what makes it special..."
        class="min-h-[100px] resize-y rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
        rows="4"
      ></textarea>
    </div>

    <div class="flex flex-col md:col-span-2">
      <label for="address" class="mb-2 text-sm font-medium text-gray-700"
        >Address</label
      >
      <input
        id="address"
        type="text"
        bind:value={businessProfile.address}
        placeholder="Full address"
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col">
      <label for="phone" class="mb-2 text-sm font-medium text-gray-700"
        >Phone Number</label
      >
      <input
        id="phone"
        type="tel"
        bind:value={businessProfile.phone}
        placeholder="+1 (555) 123-4567"
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col">
      <label for="email" class="mb-2 text-sm font-medium text-gray-700"
        >Contact Email</label
      >
      <input
        id="email"
        type="email"
        bind:value={businessProfile.email}
        placeholder="contact@property.com"
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col">
      <label for="checkin" class="mb-2 text-sm font-medium text-gray-700"
        >Check-in Time</label
      >
      <input
        id="checkin"
        type="time"
        bind:value={businessProfile.checkInTime}
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col">
      <label for="checkout" class="mb-2 text-sm font-medium text-gray-700"
        >Check-out Time</label
      >
      <input
        id="checkout"
        type="time"
        bind:value={businessProfile.checkOutTime}
        class="rounded-lg border-2 border-gray-200 bg-white px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
    </div>

    <div class="flex flex-col md:col-span-2">
      <label class="mb-2 text-sm font-medium text-gray-700">Amenities</label>
      <div class="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {#each availableAmenities as amenity}
          <label class="flex cursor-pointer items-center text-sm text-gray-700">
            <input
              type="checkbox"
              value={amenity}
              bind:group={businessProfile.amenities}
              class="mr-2 scale-110 transform"
            />
            {amenity}
          </label>
        {/each}
      </div>
    </div>
  </div>

  <div class="flex gap-4 border-t border-gray-200 pt-4">
    <button
      on:click={saveProfile}
      class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600"
    >
      Save Profile
    </button>
  </div>
</section>

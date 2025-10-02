<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { get_all_students } from "./students/students.remote.js";
  import { get_all_staff } from "./staff/staff.remote.js";
  import { get_assignments } from "./assignments/assignments.remote.js";

  const { params } = $props();

  const total_students = $derived((await get_all_students()).length);
  const total_staff = $derived((await get_all_staff(params.school_id)).length);
  const total_assignments = $derived(
    (await get_assignments(params.school_id)).length,
  );

  let studentGrowthChart: HTMLCanvasElement;
  let engagementChart: HTMLCanvasElement;
  let studentGrowthChartInstance: Chart;

  // Year filter for student growth chart
  let selectedYear = $state(2024);

  const upcomingEvents = [
    { date: "Today, 2:00 PM", event: "Staff Meeting", type: "meeting" },
    { date: "Tomorrow, 9:00 AM", event: "Grade 12 Physics Exam", type: "exam" },
    {
      date: "Wed, 10:00 AM",
      event: "Parent-Teacher Conference",
      type: "conference",
    },
    { date: "Thu, 3:00 PM", event: "Sports Day Preparation", type: "event" },
    {
      date: "Fri, 11:00 AM",
      event: "Monthly Assessment Review",
      type: "review",
    },
  ];

  // Student data for different years
  const studentDataByYear = {
    2024: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      enrollment: [
        1000, 1050, 1120, 1180, 1220, 1247, 1255, 1263, 1270, 1285, 1292, 1300,
      ],
      expelled: [2, 1, 3, 2, 1, 0, 1, 2, 1, 0, 1, 2],
      graduated: [0, 0, 0, 0, 0, 145, 0, 0, 0, 0, 0, 178],
    },
    2023: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      enrollment: [
        920, 965, 1010, 1055, 1095, 1130, 1145, 1160, 1175, 1185, 1195, 1000,
      ],
      expelled: [1, 2, 1, 3, 2, 1, 2, 1, 0, 1, 2, 1],
      graduated: [0, 0, 0, 0, 0, 125, 0, 0, 0, 0, 0, 195],
    },
    2022: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      enrollment: [
        850, 885, 920, 955, 985, 1015, 1025, 1035, 1045, 1055, 1065, 920,
      ],
      expelled: [3, 1, 2, 1, 1, 2, 1, 3, 1, 0, 1, 2],
      graduated: [0, 0, 0, 0, 0, 110, 0, 0, 0, 0, 0, 145],
    },
  };

  function updateStudentGrowthChart() {
    const data = studentDataByYear[selectedYear];

    studentGrowthChartInstance.data = {
      labels: data.labels,
      datasets: [
        {
          label: "Student Enrollment",
          data: data.enrollment,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Expelled Students",
          data: data.expelled,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: false,
          tension: 0.4,
        },
        {
          label: "Graduated Students",
          data: data.graduated,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: false,
          tension: 0.4,
        },
      ],
    };
    studentGrowthChartInstance.update();
  }

  onMount(() => {
    // Student Growth Chart
    const data = studentDataByYear[selectedYear];
    studentGrowthChartInstance = new Chart(studentGrowthChart, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Student Enrollment",
            data: data.enrollment,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Expelled Students",
            data: data.expelled,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Graduated Students",
            data: data.graduated,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Student Growth Trends - ${selectedYear}`,
          },
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Engagement Chart
    new Chart(engagementChart, {
      type: "doughnut",
      data: {
        labels: [
          "Assignments Submitted",
          "Late Submissions",
          "Missing Assignments",
        ],
        datasets: [
          {
            data: [78, 15, 7],
            backgroundColor: [
              "rgb(34, 197, 94)",
              "rgb(251, 191, 36)",
              "rgb(239, 68, 68)",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Assignment Engagement",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    });
  });

  function getEventIcon(type: string): string {
    switch (type) {
      case "meeting":
        return "icon-[mdi--account-group]";
      case "exam":
        return "icon-[mdi--clipboard-text]";
      case "conference":
        return "icon-[mdi--handshake]";
      case "event":
        return "icon-[mdi--calendar-star]";
      case "review":
        return "icon-[mdi--clipboard-check-multiple]";
      default:
        return "icon-[mdi--calendar]";
    }
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
    <p class="text-gray-600">
      Welcome back! Here's what's happening at your school today.
    </p>
  </header>

  <!-- Key Metrics Cards -->
  <section class="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    {@render stat_card(
      "icon-[mdi--account-group]",
      total_students,
      "Total Students",
    )}
    {@render stat_card("icon-[mdi--account-tie]", total_staff, "Total Staff")}
    {@render stat_card(
      "icon-[mdi--clipboard-list]",
      total_assignments,
      "Uploaded Assignments",
    )}
    {@render stat_card("icon-[mdi--calendar-check]", 0, "Events")}
  </section>

  <!-- Charts Section -->
  <section class="mb-8 grid">
    <!-- Student Growth Chart -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Student Growth Trends
        </h3>
        <div class="flex items-center space-x-2">
          <label for="year-filter" class="text-sm text-gray-600">Year:</label>
          <select
            id="year-filter"
            bind:value={selectedYear}
            onchange={updateStudentGrowthChart}
            class="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>
      <div class="h-80">
        <canvas bind:this={studentGrowthChart}></canvas>
      </div>
    </div>
  </section>

  <!-- Activity and Events Section -->
  <section class="grid gap-6 grid-cols-1 lg:grid-cols-2">
    <!-- Engagement Chart -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="h-80">
        <canvas bind:this={engagementChart}></canvas>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <i class="icon-[mdi--calendar-clock] mr-2 text-gray-600"></i>
          Upcoming Events
        </h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          {#each upcomingEvents as event}
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <i class="{getEventIcon(event.type)} text-gray-500 text-xl"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-900">{event.event}</p>
                <p class="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          {/each}
        </div>
        <button class="btn-link mt-4 text-blue-600 hover:text-blue-800">
          View all events →
        </button>
      </div>
    </div>
  </section>
</div>

{#snippet stat_card(icon: string, stat: number, text: string)}
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-2xl font-bold text-gray-900">{stat}</p>
        <p class="text-sm text-gray-600 mt-1">{text}</p>
      </div>
      <i class="{icon} text-2xl"></i>
    </div>
  </div>
{/snippet}

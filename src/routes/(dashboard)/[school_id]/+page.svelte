<script lang="ts">
  import { onMount, tick } from "svelte";
  // import { get_assignments } from "./assignments/assignments.remote.js";
  import { get_all_staff } from "./staff/staff.remote.js";
  import { get_all_students } from "./students/students.remote.js";
  import {
    type ChartItem,
    Chart,
    Colors,
    Tooltip,
    LineElement,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    DoughnutController,
    ArcElement,
  } from "chart.js";

  Chart.register(
    Colors,
    Tooltip,
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    DoughnutController,
    ArcElement
  );

  const { params } = $props();

  const total_students = $derived((await get_all_students(params.school_id)).length);
  const total_staff = $derived((await get_all_staff(params.school_id)).length);
  const total_assignments = 0;
  //   $derived(
  //   (await get_assignments(params.school_id)).length,
  // );
  let current_year = $derived(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  let student_chart_instance: Chart;
  let student_canvas: ChartItem;

  let engagement_instance: Chart;
  let engagement_canvas: ChartItem;

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

  onMount(async () => {
    await tick();

    if (student_chart_instance) {
      student_chart_instance.destroy();
    }

    student_chart_instance = new Chart(student_canvas, {
      type: "line",
      data: {
        labels: months.map((m) => m),
        datasets: [
          {
            label: "Students Enrolled",
            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
          },
          {
            label: "Graduated Students",
            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
          },
          {
            label: "Expelled Students",
            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
          },
        ],
      },
    });
  });

  onMount(async () => {
    await tick();

    if (engagement_instance) {
      engagement_instance.destroy();
    }

    engagement_instance = new Chart(engagement_canvas, {
      type: "doughnut",
      data: {
        labels: ["Submitted", "Late Submissions", "Missing Assignments"],
        datasets: [
          {
            data: Array.from({ length: 3 }, () => Math.floor(Math.random() * 100)),
          },
        ],
      },
    });
  });

  function get_event_icon(type: string): string {
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
    <p class="text-gray-600">Welcome back! Here's what's happening at your school today.</p>
  </header>

  <!-- Key Metrics Cards -->
  <section class="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    {@render stat_card("icon-[mdi--account-group]", total_students, "Total Students")}
    {@render stat_card("icon-[mdi--account-tie]", total_staff, "Total Staff")}
    {@render stat_card("icon-[mdi--clipboard-list]", total_assignments, "Uploaded Assignments")}
    {@render stat_card("icon-[mdi--calendar-check]", 0, "Events")}
  </section>

  <!-- Charts Section -->
  <section class="mb-8 grid">
    <!-- Student Growth Chart -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Student Growth</h3>
        <div class="flex items-center space-x-2">
          <label for="year-filter" class="text-sm text-gray-600">Year:</label>
          <select bind:value={current_year} class="select">
            {#each years as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="h-80">
        <canvas bind:this={student_canvas} style="width: 100%; height: 100%;"> </canvas>
      </div>
    </div>
  </section>

  <!-- Activity and Events Section -->
  <section class="grid gap-6 grid-cols-1 lg:grid-cols-2">
    <!-- Engagement Chart -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="h-80">
        <canvas bind:this={engagement_canvas}></canvas>
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
                <i class="{get_event_icon(event.type)} text-gray-500 text-xl"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-900">{event.event}</p>
                <p class="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          {/each}
        </div>
        <button class="btn-link mt-4 text-blue-600 hover:text-blue-800"> View all events → </button>
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

<script lang="ts">
  import { Tabs } from "melt/components";
  import Subjects from "./subjects.svelte";
  import Classes from "./classes.svelte";
  import SchoolYears from "./school-years.svelte";
  import Departments from "./departments.svelte";
  import Announcements from "./announcements.svelte";

  const tab_ids = [
    "classes",
    "subjects",
    "school-years",
    "departments",
    "announcements",
  ];

  function getTabIcon(id: string) {
    if (id === "classes") return "classroom";
    else if (id === "subjects") return "book-open";
    else if (id === "school-years") return "calendar-range";
    else if (id === "departments") return "domain";
    else if (id === "announcements") return "bullhorn";
    else return "circle";
  }

  let selected_tab = $state(tab_ids[0]);
</script>

<svelte:head>
  <title>School Management</title>
</svelte:head>

<section class="max-w-7xl mx-auto p-6">
  <header class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">School Management</h1>
    <p class="text-gray-600">
      Manage your school's classes, subjects, academic years, departments, and
      announcements
    </p>
  </header>

  <div class="w-full">
    <Tabs bind:value={selected_tab}>
      {#snippet children(tabs)}
        <div
          {...tabs.triggerList}
          class="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4"
        >
          {#each tab_ids as id}
            <button
              {...tabs.getTrigger(id)}
              class="px-4 py-2 rounded-lg border transition-colors capitalize
                {selected_tab === id
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}"
            >
              <i class="icon-[mdi--{getTabIcon(id)}] size-4 mr-2"></i>
              {id.replace("-", " ")}
            </button>
          {/each}
        </div>

        {#if selected_tab === "classes"}
          <div {...tabs.getContent("classes")}>
            <Classes />
          </div>
        {/if}

        {#if selected_tab === "subjects"}
          <div {...tabs.getContent("subjects")}>
            <Subjects />
          </div>
        {/if}

        {#if selected_tab === "school-years"}
          <div {...tabs.getContent("school-years")}>
            <SchoolYears />
          </div>
        {/if}

        {#if selected_tab === "departments"}
          <div {...tabs.getContent("departments")}>
            <Departments />
          </div>
        {/if}

        {#if selected_tab === "announcements"}
          <div {...tabs.getContent("announcements")}>
            <Announcements />
          </div>
        {/if}
      {/snippet}
    </Tabs>
  </div>
</section>

<script>
  import BreadCrumbs from "$lib/components/shared/BreadCrumbs.svelte";
  import DashboardCard from "./DashboardCard.svelte";

  export let data;
</script>

<BreadCrumbs />

<section class="mt-10 grid px-5 gap-5 grid-cols-4">
  <DashboardCard
    stat={data.totalStudents}
    text="Registered Students"
    icon="mdi:people-group-outline"
  />
  <DashboardCard
    stat={data.totalSubjects}
    text="Subjects Listed"
    icon="material-symbols:format-list-bulleted-rounded"
  />
  <DashboardCard
    stat={data.totalClasses}
    text="Total Classes"
    icon="healthicons:i-training-class-outline"
  />
  <DashboardCard stat={1} text="Results Declared" />
</section>

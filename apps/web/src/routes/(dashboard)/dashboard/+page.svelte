<script>
  import BreadCrumbs from "$lib/components/shared/BreadCrumbs.svelte";
  import DashboardCard from "./DashboardCard.svelte";
</script>

<BreadCrumbs />

<section class="mt-10 grid px-5 gap-5 grid-cols-4">
  <DashboardCard
    stat={1}
    text="Registered Students"
    icon="mdi:people-group-outline"
  />
  <DashboardCard
    stat={1}
    text="Subjects Listed"
    icon="material-symbols:format-list-bulleted-rounded"
  />
  <DashboardCard
    stat={1}
    text="Total Classes"
    icon="healthicons:i-training-class-outline"
  />
  <DashboardCard stat={1} text="Results Declared" />
</section>

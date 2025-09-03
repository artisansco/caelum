<script lang="ts">
  import Icon from "@iconify/svelte";
  import dayjs from "dayjs";
  import { enhance } from "$app/forms";
  import BreadCrumbs from "$lib/components/shared/BreadCrumbs.svelte";
  import Button from "$lib/components/shared/Button.svelte";
  import Input from "$lib/components/shared/Input.svelte";
  import type { PageProps } from "./$types";

  const { data, form }: PageProps = $props();
</script>

<BreadCrumbs>
  <span slot="title">Manage Classes</span>
</BreadCrumbs>

<section class="mt-5 p-4">
  <table class="border-collapse w-full table-auto">
    <thead>
      <tr class="border bg-gray-600 text-left text-white">
        <th class="p-2">Class Name</th>
        <th class="p-2">Subjects</th>
        <th class="p-2">Students</th>
        <th class="p-2">Date Added</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {#each [] as class_ (class_?.id)}
        <tr class="group">
          <td class="border p-2 text-gray-700">{class_?.name}</td>
          <td class="border p-2 text-gray-700">{class_?._count.subjects}</td>
          <td class="border p-2 text-gray-700">{class_?._count.students}</td>
          <td class="border p-2 text-gray-700">
            {dayjs(class_?.dateCreated).format("MMMM DD, YYYY - HH:mm A")}
          </td>
          <td
            class="opacity-0 px-2 text-gray-700 items-center group-hover:opacity-100"
          >
            <span class="flex h-full gap-4">
              <a href="/classes/edit?id={class_?.id}">
                <Icon icon="bi:pen-fill" class="text-blue-400" />
              </a>
              <form action="/classes?/deleteClass" method="post" use:enhance>
                <Input type="hidden" name="id" value={class_?.id} />
                <Button><Icon icon="mdi:trash" class="text-red-400" /></Button>
              </form>
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

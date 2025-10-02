<script lang="ts">
  import { page } from "$app/state";
  import { add_class, get_classes, delete_class } from "../../school.remote";
</script>

<div class="gap-8 flex flex-col max-w-sm">
  <!-- Form to add classes -->
  <form {...add_class} class="shadow p-5">
    <input type="hidden" name="school_id" value={page.params.school_id} />
    <div class="flex flex-col gap-1 mb-2">
      <label for="name" class="label">Class Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="JSS 1"
        class="input"
        required
      />
    </div>

    <button type="submit" class="btn-sm" disabled={add_class.pending > 0}>
      {#if add_class.pending > 0}
        <i class="icon-[mdi--loading] animate-spin"></i>
        Adding Class...
      {:else}
        <i class="icon-[mdi--content-save]"></i>
        Add Class
      {/if}
    </button>
  </form>

  <!-- Table -->
  <table class="table min-w-full divide-y divide-gray-200 h-fit">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-5 py-3 text-start">
          <span class="font-semibold text-gray-700 capitalize">Class Name</span>
        </th>
        <th scope="col" class="px-5 py-3 text-start"></th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-200">
      {#each await get_classes(String(page.params.school_id)) as { id, name }}
        <tr class="[&>td]:px-5 [&>td]:py-3">
          <td>{name}</td>
          <td class="">
            <button
              type="button"
              class="btn-sm-ghost"
              onclick={async () =>
                await delete_class({
                  school_id: String(page.params.school_id),
                  class_id: id,
                })}
            >
              <i class="icon-[mdi--trash] size-4 bg-red-500"></i>
              <span class="sr-only">delete</span>
            </button>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="3" class="italic text-center">no data</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <!-- End Table -->
</div>

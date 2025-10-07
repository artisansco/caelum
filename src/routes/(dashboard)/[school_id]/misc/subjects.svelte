<script lang="ts">
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";
  import { add_subject, delete_subject, get_subjects } from "./misc.remote";

  $effect(() => {
    if (add_subject.result?.message) {
      toast.info(add_subject.result.message);
    }
  });
</script>

<div class="grid grid-cols-[1fr_25rem] gap-8">
  <!-- Table -->
  <table class="table min-w-full divide-y divide-gray-200 h-fit">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-5 py-3 text-start">
          <span class="font-semibold text-gray-700 capitalize">
            Subject Name
          </span>
        </th>
        <th scope="col" class="px-5 py-3 text-start">
          <span class="font-semibold text-gray-700 capitalize">
            Subject Code
          </span>
        </th>
        <th scope="col" class="px-6 py-3 text-end"></th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-200">
      {#each await get_subjects() as subject}
        <tr class="group [&>td]:px-5 [&>td]:py-3">
          <td>{subject.name}</td>
          <td>{subject.code || "N/A"}</td>
          <td class="group-hover:opacity-100 opacity-0 transition-opacity">
            <button
              type="button"
              class="btn-sm-ghost"
              onclick={async () => await delete_subject(subject.id)}
            >
              <i class="icon-[mdi--trash] size-4 bg-red-600"></i>
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

  <!-- Form to add subjects -->
  <aside class="block shadow p-5 rounded-lg border h-fit">
    <form {...add_subject}>
      <h3 class="font-semibold mb-5">Add New Subject</h3>

      <fieldset class="grid gap-4">
        <input type="hidden" name="school_id" value={page.params.school_id} />
        <div class="flex flex-col gap-1">
          <label for="name" class="label">Subject Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Mathemathics"
            class="input"
            required
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="code" class="label">Subject Code</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="CODE-001"
            class="input"
          />
        </div>

        <button type="submit" class="btn" disabled={add_subject.pending > 0}>
          {#if add_subject.pending > 0}
            <i class="icon-[mdi--loading] animate-spin"></i>
            Adding Class...
          {:else}
            <i class="icon-[mdi--content-save]"></i>
            Add Class
          {/if}
        </button>
      </fieldset>
    </form>
  </aside>
</div>

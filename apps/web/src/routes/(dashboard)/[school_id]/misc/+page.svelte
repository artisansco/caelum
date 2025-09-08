<script lang="ts">
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";
  import {
    add_subject,
    delete_subject,
    get_all_subjects,
  } from "./subjects.remote";

  $effect(() => {
    if (add_subject.result?.message) {
      toast.info(add_subject.result.message);
    }
  });
</script>

<section class="max-w-6xl">
  <div class="border-b-2 tabs w-full mb-15">
    <nav class="w-full py-2">
      <a href="{page.url.pathname}/" class="btn-outline">Subjects</a>
      <a href="{page.url.pathname}/" class="btn-outline">Classes</a>
      <a href="{page.url.pathname}/" class="btn-outline">Results</a>
    </nav>
  </div>

  <div class="grid grid-cols-[1fr_25rem] gap-8">
    <!-- Table -->
    <table class="table min-w-full divide-y divide-gray-200 h-fit">
      <thead class="bg-gray-50">
        <tr>
          {@render table_header("Subject Name")}
          {@render table_header("Subject Code")}
          <th scope="col" class="px-6 py-3 text-end"></th>
        </tr>
      </thead>

      <svelte:boundary>
        <tbody class="divide-y divide-gray-200">
          {#await get_all_subjects() then subjects}
            {#each subjects as subject}
              <tr class="group">
                <td class="px-5 py-3">{subject.name}</td>
                <td class="px-5 py-3">{subject.code || "N/A"}</td>
                <td
                  class="px-5 py-3 group-hover:opacity-100 opacity-0 transition-opacity"
                >
                  <form {...delete_subject}>
                    <input type="hidden" name="subject_id" value={subject.id} />
                    <button type="submit" class="btn-sm-ghost">
                      <i class="icon-[mdi--trash] size-4 bg-red-500"></i>
                      <span class="sr-only">delete</span>
                    </button>
                  </form>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="3" class="italic text-center">no data</td>
              </tr>
            {/each}
          {/await}
        </tbody>
      </svelte:boundary>
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
</section>

{#snippet table_header(label: string)}
  <th scope="col" class="px-5 py-3 text-start">
    <span class="font-semibold text-gray-700 capitalize">{label}</span>
  </th>
{/snippet}

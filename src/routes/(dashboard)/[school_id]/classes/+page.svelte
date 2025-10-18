<script lang="ts">
  import Dialog from "$lib/components/dialog.svelte";
  import ClassCard from "./class-card.svelte";
  import { add_class, get_classes } from "./classes.remote";
  import { toast } from "svelte-sonner";
  import { get_field_error } from "$lib/utils";

  const { params } = $props();
  let toggle_dialog = $state(false);

  $effect(() => {
    if (add_class.result?.message) {
      toast.success(add_class.result.message);
    }
  });
</script>

<section class="max-w-7xl mx-auto p-6">
  <header class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Classes</h1>
        <p class="text-gray-600">Manage your school's class levels</p>
      </div>

      <Dialog label="Add New Class" btn_txt="New Class" icon="icon-[mdi--plus]">
        <form
          {...add_class.enhance(async ({ submit }) => await submit())}
          oninput={() => add_class.validate()}
          class="space-y-4"
        >
          <input type="hidden" name="school_id" value={params.school_id} />

          <div>
            <label for="class-name" class="block text-sm font-medium text-gray-700 mb-2">
              Class Name <span class="text-red-500">*</span>
            </label>
            <input
              {...add_class.fields.name.as("text")}
              type="text"
              placeholder="e.g., JSS 1, Grade 10, Year 7"
              class="input"
            />
            <p class="text-xs text-gray-500 my-1">Enter the name/level of the class</p>
            <small class="label text-xs text-red-500">
              {get_field_error(add_class.fields.name)}
            </small>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="submit" class="btn" disabled={add_class.pending > 0}>
              {#if add_class.pending > 0}
                <i class="icon-[mdi--loading] animate-spin"></i>
                Creating...
              {:else}
                <i class="icon-[mdi--plus]"></i>
                Create Class
              {/if}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each await get_classes(params.school_id) as class_item}
      <ClassCard {...class_item} />
    {:else}
      <div class="col-span-full">
        <div class="bg-white rounded-lg border shadow-sm p-12 text-center">
          <div class="flex flex-col items-center">
            <i class="icon-[mdi--google-classroom] text-gray-300 size-16 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Classes</h3>
            <p class="text-gray-500 mb-6">Get started by creating your first class.</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

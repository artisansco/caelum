<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import { Select } from "melt/components";
  import {
    delete_assignment,
    get_assignments,
    upload_assignment,
  } from "./assignments.remote";
  import { format } from "@formkit/tempo";

  let class_id = $state("");

  // function deleteAssignment(id: number) {
  //   if (confirm("Are you sure you want to delete this assignment?")) {
  //     assignments = assignments.filter((assignment) => assignment.id !== id);
  //     toast.success("Assignment deleted successfully!");
  //   }
  // }
  //

  $effect(() => {
    if (upload_assignment.result?.message) {
      toast.info(upload_assignment.result.message);
    }
  });

  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];
</script>

<section class="max-w-7xl">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Upload Form -->
    <div class="lg:col-span-1">
      <div class="bg-white shadow rounded-lg border p-6 sticky top-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">
          Upload Assignment
        </h2>

        <form
          {...upload_assignment.enhance(async ({ data, submit }) => {
            data.append("class_id", class_id);
            console.log(data);
            await submit();
          })}
          class="space-y-6"
          enctype="multipart/form-data"
        >
          <input type="hidden" name="school_id" value={page.params.school_id} />

          <!-- Class Selection -->
          <div>
            <Select bind:value={class_id}>
              {#snippet children(select)}
                <label
                  for={select.ids.trigger}
                  class="label mb-2 text-sm text-gray-500"
                >
                  Select Class <span class="text-red-500">*</span>
                </label>
                <button
                  {...select.trigger}
                  class="btn-outline w-full justify-between capitalize"
                >
                  {select.value || "Select Class"}
                  <i class="icon-[lucide--chevron-down] size-5"></i>
                </button>

                <div
                  {...select.content}
                  class="max-h-48 w-full cursor-default rounded-lg border border-gray-300 text-sm focus:outline-none"
                >
                  {#each classes as class_}
                    <p
                      {...select.getOption(class_, class_)}
                      class="{class_ === select.value &&
                        'bg-gray-100'} p-2 hover:bg-gray-100 capitalize"
                    >
                      {class_}
                    </p>
                  {/each}
                </div>
              {/snippet}
            </Select>
          </div>

          <!-- Assignment Details -->
          <div class="flex flex-col space-y-2">
            <label for="title" class="label text-gray-500">
              Assignment Title <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter assignment title"
              class="input"
              required
            />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="description" class="label text-gray-500">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Enter assignment description"
              class="textarea resize-none"
            ></textarea>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="dueDate" class="label text-gray-500"> Due Date </label>
            <input
              type="date"
              id="dueDate"
              name="due_date"
              class="input"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <!-- File Upload Area -->
          <div class="flex flex-col space-y-2">
            <label for="file" class="label text-gray-500">
              Assignment File <span class="text-red-500">*</span>
            </label>

            <!-- Upload Area -->
            <div class="border-2 border-dashed rounded-lg p-6 text-center">
              <i
                class="icon-[mdi--cloud-upload] text-gray-400 size-7 mx-auto block"
              ></i>
              <p class="text-sm text-gray-600">Upload files</p>
              <p class="text-xs text-gray-500 mb-2">
                PDF, DOC, DOCX, PPT, PPTX up to 10MB
              </p>
              <input
                type="file"
                name="file"
                class="input"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={upload_assignment.pending > 0}
            class="btn w-full"
          >
            {#if upload_assignment.pending > 0}
              <i class="icon-[mdi--loading] animate-spin"></i>
              Uploading...
            {:else}
              <i class="icon-[mdi--upload]"></i>
              Upload Assignment
            {/if}
          </button>
        </form>
      </div>
    </div>

    <!-- Assignments List -->
    <div class="lg:col-span-2">
      <div class="bg-white shadow rounded-lg border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Uploaded Assignments
          </h2>
        </div>

        <div class="divide-y divide-gray-200">
          <!-- {#if assignments.length > 0} -->
          <svelte:boundary>
            {#snippet pending()}{/snippet}
            {#each await get_assignments(String(page.params.school_id)) as assignment}
              <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-base font-medium text-gray-900">
                        {assignment?.title}
                      </h3>
                      <span class="badge font-light bg-blue-100 text-blue-800">
                        {assignment?.class_name || "N/A"}
                      </span>
                    </div>

                    <p class="text-sm text-gray-600 mb-3">
                      {assignment.description}
                    </p>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-500"
                    >
                      <div class="flex items-center space-x-1">
                        <i class="icon-[mdi--file-document-outline]"></i>
                        <span>{assignment.file_name || "example.docx"}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <i class="icon-[mdi--calendar]"></i>
                        <span>
                          Due: {format({
                            date: assignment.due_date,
                            format: "DD MMM, YYYY",
                          })}
                        </span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <i class="icon-[mdi--clock-outline]"></i>
                        <span>
                          Uploaded: {format({
                            date: assignment.created_at,
                            format: "DD MMM, YYYY",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2 ml-4">
                    <button type="button" class="btn-sm bg-blue-50">
                      <i class="icon-[mdi--download] text-blue-800"></i>
                      <span class="sr-only">Download</span>
                    </button>
                    <button
                      type="button"
                      class="btn-sm-destructive bg-red-50"
                      onclick={async () => {
                        const error = await delete_assignment({
                          school_id: String(page.params?.school_id),
                          assignment_id: String(assignment?.id),
                        });
                        if (error) {
                          toast.error(error.message);
                        }
                      }}
                    >
                      <i class="icon-[mdi--trash-can-outline] text-red-800"></i>
                      <span class="sr-only">Delete</span>
                    </button>

                    <form
                      method="post"
                      action="?/delete"
                      use:enhance
                      class="inline"
                    >
                      <input
                        type="hidden"
                        name="assignmentId"
                        value={assignment.id}
                      />
                      <button
                        type="submit"
                        class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <i class="icon-[mdi--trash-can-outline]"></i>
                        <span class="sr-only">Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            {:else}
              <div class="p-12 text-center">
                <i
                  class="icon-[mdi--file-document-outline] text-gray-300 text-6xl mb-4 block mx-auto"
                ></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  No assignments uploaded
                </h3>
                <p class="text-gray-500">
                  Upload your first assignment to get started.
                </p>
              </div>
            {/each}
          </svelte:boundary>
        </div>
      </div>
    </div>
  </div>
</section>

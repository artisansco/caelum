<script lang="ts">
  import Dialog from "$lib/components/dialog.svelte";
  import { melt } from "@melt-ui/svelte";
  import { delete_class } from "./classes.remote";
  import { toast } from "svelte-sonner";
  import { get_all_students } from "../students/students.remote";
  import { get_assignments } from "../assignments/assignments.remote";
  import type { Class } from "$lib/types";

  const props: Class = $props();

  let studs_promise = $derived(get_all_students(props.school_id!));
  let students = $derived(await studs_promise);

  let assigns_promise = $derived(get_assignments(props.school_id!));
  let assignments = $derived(await assigns_promise);

  let student_count = $derived.by(() => {
    const num = students?.filter((student) => student.class_id === props.id).length || 0;
    return num;
  });

  let assignment_count = $derived.by(() => {
    const num = assignments.filter((assignment) => assignment.class_id === props.id).length;
    return num;
  });

  let toggle_dialog = $state(false);
</script>

<div class="w-full p-4 bg-white rounded-lg border hover:shadow-md">
  <div class="flex items-start justify-between mb-3">
    <h3 class="font-semibold text-gray-900 text-lg">
      {props.name || "N/A"}
    </h3>
    <div class="flex-shrink-0">
      <Dialog label="Delete Class">
        {#snippet trigger(trigger: any)}
          <button use:melt={trigger} class="btn-sm-destructive bg-red-50 text-red-500">
            <i class="icon-[mdi--trash]"></i>
          </button>
        {/snippet}
        <div class="space-y-4">
          <p>Are you sure you want to delete {props.name}? This action cannot be undone.</p>
          <button
            type="button"
            class="btn-sm-destructive"
            disabled={delete_class.pending > 0}
            onclick={async () => {
              const result = await delete_class(props.id);
              if (result?.message) toast.success(result.message);
            }}
          >
            <i class="icon-[mdi--trash]"></i>
            Delete Class
          </button>
        </div>
      </Dialog>
    </div>
  </div>

  <!-- Class Stats -->
  <div class="grid grid-cols-2 gap-3 mb-3">
    <!-- Students Count -->
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
        <i class="icon-[mdi--account-student] size-3 text-blue-600"></i>
      </div>
      <div>
        <p class="text-xs text-gray-500">Students</p>
        <p class="text-sm font-medium text-gray-900">{student_count}</p>
      </div>
    </div>

    <!-- Assignments Count -->
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
        <i class="icon-[mdi--book-open-variant] size-3 text-green-600"></i>
      </div>
      <div>
        <p class="text-xs text-gray-500">Assignments</p>
        <p class="text-sm font-medium text-gray-900">{assignment_count}</p>
      </div>
    </div>
  </div>

  <!-- Teacher Info -->
  <!-- <div class="flex items-center space-x-2 pt-2 border-t border-gray-100">
		<div class="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
			<i class="icon-[mdi--account-tie] size-3 text-purple-600"></i>
		</div>
		<div class="flex-1 min-w-0">
			<p class="text-xs text-gray-500">Teacher</p>
			<p class="text-sm font-medium text-gray-900 truncate" title="teacher_name">teacher_name"</p>
		</div>
	</div> -->
</div>

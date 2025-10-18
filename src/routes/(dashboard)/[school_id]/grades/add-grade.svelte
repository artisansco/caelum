<script lang="ts">
  import { page } from "$app/state";
  import { add_grade } from "./grades.remote";
  import { get_all_students } from "../students/students.remote";
  import { get_subjects } from "../subjects/subjects.remote";
  import { get_all_staff } from "../staff/staff.remote";
  import { toast } from "svelte-sonner";
  import { grade_types, school_terms } from "$lib/constants";

  let { show_add_grade = $bindable(true) } = $props();
  const { academic_year, actual_score, grade_type, graded_by, max_score, notes, term } =
    add_grade.fields;

  let studs_promise = $derived(get_all_students(String(page.params.school_id)));
  let staff_promise = $derived(get_all_staff(String(page.params.school_id)));
  let subjs_promise = $derived(get_subjects());

  let students = $derived(await studs_promise);
  let subjects = $derived(await subjs_promise);
  let staff = $derived(await staff_promise);
</script>

{#if show_add_grade}
  <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">Add New Grade</h2>
    <form
      {...add_grade.enhance(async ({ submit }) => {
        await submit();
        show_add_grade = false;
        toast.success("Grade added successfully");
      })}
    >
      <input type="hidden" name="school_id" value={page.params.school_id} />

      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <label for="student_id" class="label">Student</label>
          <select id="student_id" name="student_id" class="select w-full">
            <option value="" selected disabled>Select Student</option>
            {#each students as student}
              <option value={student.id}>
                {student.first_name}
                {student.last_name} ({student.admission_number})
              </option>
            {/each}
          </select>
        </div>

        <div>
          <label for="subject_id" class="label">Subject</label>
          <select id="subject_id" name="subject_id" class="select w-full">
            <option value="" selected disabled>Select Subject</option>
            {#each subjects as subject}
              <option value={subject.id}>{subject.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="grade_type" class="label">Grade Type</label>
          <select id="grade_type" name="grade_type" class="select w-full">
            {#each grade_types as grade_type}
              <option value={grade_type}>{grade_type}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="actual_score" class="label">Actual Score</label>
          <input {...actual_score.as("number")} type="number" min="0" class="input" />
        </div>

        <div>
          <label for="max_score" class="label">Maximum Score</label>
          <input {...max_score.as("number")} type="number" min="1" value="100" class="input" />
        </div>

        <div>
          <label for="term" class="label">Term</label>
          <select id="term" name="term" class="select w-full">
            {#each school_terms as term}
              <option value={term} class="capitalize">{term}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="academic_year" class="label">Academic Year</label>
          <input
            {...academic_year.as("text")}
            type="text"
            class="input"
            value={new Date().getFullYear().toString()}
          />
        </div>

        <div>
          <label for="graded_by" class="label">Graded By</label>
          <select id="graded_by" name="graded_by" class="select w-full">
            <option value="" selected disabled>Select Grader</option>
            {#each staff as staff_member}
              <option value={staff_member.id}>
                {staff_member.first_name}
                {staff_member.last_name}
              </option>
            {/each}
          </select>
        </div>

        <div>
          <label for="notes" class="label">Notes (Optional)</label>
          <textarea
            {...notes.as("text")}
            rows="3"
            class="textarea resize-none"
            placeholder="Additional notes about this grade"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button type="button" onclick={() => (show_add_grade = false)} class="btn-sm-destructive">
          Cancel
        </button>
        <button type="submit" class="btn-sm" disabled={add_grade.pending > 0}>
          {#if add_grade.pending > 0}
            <i class="icon-[mdi--loading] animate-spin"></i>
            Adding...
          {:else}
            Add Grade
          {/if}
        </button>
      </div>
    </form>
  </div>
{/if}

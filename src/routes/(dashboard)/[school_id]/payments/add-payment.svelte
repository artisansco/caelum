<script lang="ts">
  import { add_payment } from "./payments.remote";
  import { get_all_students } from "../students/students.remote";
  import { get_all_staff } from "../staff/staff.remote";
  import { page } from "$app/state";
  import { payment_types, payment_methods } from "$lib/constants";
  import { get_field_error } from "$lib/utils";

  let { show_payment = $bindable(false) } = $props();
  const { amount, notes, received_by, payment_date, payment_method, payment_type, student_id } =
    add_payment.fields;

  payment_type.set("tuition");
  payment_method.set("cash");
</script>

<!-- Add Payment Form -->
{#if show_payment}
  <section class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Add New Payment</h2>
    <form
      {...add_payment.enhance(async ({ submit }) => {
        await submit();
        // show_payment = false;
      })}
    >
      <input type="hidden" name="school_id" value={page.params.school_id} />

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label for="student_id" class="block text-sm font-medium text-gray-700 mb-2">
            Student
          </label>
          <select {...student_id.as("select")} class="select w-full">
            <option value="" selected disabled>Select a student</option>
            {#each await get_all_students(page.params.school_id!) as student}
              <option value={student.id}>
                {student.first_name}
                {student.last_name}
              </option>
            {/each}
          </select>
          <span class="text-xs text-red-500 mt-1">{get_field_error(student_id)}</span>
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input {...amount.as("number")} type="number" min="0" class="input w-full" />
          <span class="text-xs text-red-500 mt-1">{get_field_error(amount)}</span>
        </div>

        <div>
          <label for="payment_type" class="block text-sm font-medium text-gray-700 mb-2">
            Payment Type
          </label>
          <select {...payment_type.as("select")} class="select w-full capitalize">
            {#each payment_types as type}
              <option value={type} class="capitalize">{type}</option>
            {/each}
          </select>
          <span class="text-xs text-red-500 mt-1">{get_field_error(payment_type)}</span>
        </div>

        <div>
          <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select {...payment_method.as("select")} class="select w-full capitalize">
            {#each payment_methods as method}
              <option value={method} class="capitalize">{method.replace("_", " ")}</option>
            {/each}
          </select>
          <span class="text-xs text-red-500 mt-1">{get_field_error(payment_method)}</span>
        </div>

        <div>
          <label for="payment_status" class="block text-sm font-medium text-gray-700 mb-2">
            Payment Date
          </label>
          <input
            {...payment_date.as("date")}
            type="date"
            value={new Date().toISOString().split("T")[0]}
            class="input w-full"
          />
          <span class="text-xs text-red-500 mt-1">{get_field_error(payment_date)}</span>
        </div>

        <div>
          <label for="received_by" class="block text-sm font-medium text-gray-700 mb-2">
            Received By
          </label>
          <select {...received_by.as("select")} class="select w-full">
            <option value="" selected disabled>Select staff member</option>
            {#each await get_all_staff(page.params.school_id!) as staff_member}
              <option value={staff_member.id}>
                {staff_member.first_name}
                {staff_member.last_name}
              </option>
            {/each}
          </select>
          <span class="text-xs text-red-500 mt-1">{get_field_error(received_by)}</span>
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Extra Notes
          </label>
          <textarea
            {...notes.as("text")}
            class="textarea w-full resize-none"
            placeholder="extra notes about the payment"
          ></textarea>
          <span class="text-xs text-red-500 mt-1">{get_field_error(notes)}</span>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button type="button" onclick={() => (show_payment = false)} class="btn-sm-destructive">
          Cancel
        </button>
        <button type="submit" class="btn-sm" disabled={add_payment.pending > 0}>
          {#if add_payment.pending > 0}
            <i class="icon-[mdi--loading] animate-spin"></i>
            Adding...
          {:else}
            Add Payment
          {/if}
        </button>
      </div>
    </form>
  </section>
{/if}

<script lang="ts">
  import { toast } from "svelte-sonner";
  import { add_student } from "../students.remote";
  import { get_classes } from "../../classes/classes.remote";
  import { get_field_error } from "$lib/utils";

  const { params } = $props();
  const {
    address,
    admission_date,
    admission_number,
    email,
    first_name,
    last_name,
    middle_name,
    phone_number,
    gender,
    class_id,
  } = add_student.fields;

  $effect(() => {
    if (add_student.result?.message) {
      toast.info(add_student.result.message);
    }
  });

  /** generate a random admission number */
  function generate_admission_number() {
    admission_number.set(Math.random().toString(36).substring(2, 15).toUpperCase());
  }
</script>

<section class="max-w-6xl">
  <form {...add_student.enhance(async ({ submit }) => await submit())}>
    <h2 class="mb-6 text-xl">Add new student</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <input type="hidden" value={params.school_id} name="school_id" />

      <div class="flex flex-col space-y-2">
        <label for="first_name" class="label text-gray-500">First Name</label>
        <input {...first_name.as("text")} type="text" placeholder="John" class="input" />
        <span class="text-xs text-red-500">{get_field_error(first_name)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="middle_name" class="label text-gray-500">Middle Name</label>
        <input {...middle_name.as("text")} type="text" class="input" />
        <span class="text-xs text-red-500">{get_field_error(middle_name)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="last_name" class="label text-gray-500">Last Name</label>
        <input {...last_name.as("text")} type="text" placeholder="Doe" class="input" />
        <span class="text-xs text-red-500">{get_field_error(last_name)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_number" class="label text-gray-500"> Admission Number </label>
        <div class="flex items-center gap-x-3">
          <input {...admission_number.as("text")} type="text" class="input" />
          <button type="button" class="btn-sm" onclick={generate_admission_number}>
            <i class="icon-[mdi--rotate-clockwise]"></i>
            <span class="sr-only">generate</span>
          </button>
        </div>
        <span class="text-xs text-red-500">{get_field_error(admission_number)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="email" class="label text-gray-500">Email</label>
        <input {...email.as("email")} type="email" placeholder="johndoe@acme.com" class="input" />
        <span class="text-xs text-red-500">{get_field_error(email)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="address" class="label text-gray-500">Address</label>
        <input {...address.as("text")} type="text" placeholder="2 Wise lane" class="input" />
        <span class="text-xs text-red-500">{get_field_error(address)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_date" class="label text-gray-500">Admission Date</label>
        <input {...admission_date.as("date")} type="date" class="input" />
        <span class="text-xs text-red-500">{get_field_error(admission_date)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="phone_number" class="label text-gray-500">Phone Number</label>
        <input {...phone_number.as("tel")} type="tel" placeholder="+232-99-456-890" class="input" />
        <span class="text-xs text-red-500">{get_field_error(phone_number)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <div class="flex items-center gap-5">
          <p class="text-gray-600">Gender:</p>
          <div class="flex items-center gap-10">
            {#each ["male", "female"] as gen}
              <div class="flex items-center gap-2">
                <input
                  {...gender.as("radio", gen)}
                  id={gen}
                  checked={gen === "male"}
                  class="input"
                />
                <label for={gen} class="label capitalize">{gen}</label>
              </div>
            {/each}
          </div>
        </div>
        <span class="text-xs text-red-500">{get_field_error(gender)}</span>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="class_id" class="label text-gray-500">Class</label>
        <select id="class_id" {...class_id.as("select")} class="select w-full">
          <option value="" selected disabled>Select a class</option>
          {#each await get_classes(params.school_id) as class_item}
            <option value={class_item.id}>{class_item.name}</option>
          {/each}
        </select>
        <span class="text-xs text-red-500">{get_field_error(class_id)}</span>
      </div>
    </div>

    <button type="submit" class="btn" disabled={add_student.pending > 0}>
      {#if add_student.pending > 0}
        <i class="icon-[mdi--loading] animate-spin"></i>
        <span>Adding student...</span>
      {:else}
        <i class="icon-[mdi--content-save]"></i>
        <span>Add Student</span>
      {/if}
    </button>
  </form>
</section>

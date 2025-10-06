<script lang="ts">
  import { toast } from "svelte-sonner";
  import { add_student } from "../students.remote";

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
  } = add_student.fields;

  $effect(() => {
    if (add_student.result?.message) {
      toast.info(add_student.result.message);
    }
  });

  /** generate a random admission number */
  function generate_admission_number() {
    admission_number.set(
      Math.random().toString(36).substring(2, 15).toUpperCase(),
    );
  }
</script>

<section class="max-w-6xl">
  <form {...add_student} oninput={() => add_student.validate()}>
    <h2 class="mb-6 text-xl">Add new student</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <input type="hidden" value={params.school_id} name="school_id" />

      <div class="flex flex-col space-y-2">
        <label for="first_name" class="label text-gray-500">First Name</label>
        <input
          {...first_name.as("text")}
          type="text"
          placeholder="John"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="middle_name" class="label text-gray-500">Middle Name</label>
        <input {...middle_name.as("text")} type="text" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="last_name" class="label text-gray-500">Last Name</label>
        <input
          {...last_name.as("text")}
          type="text"
          placeholder="Doe"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_number" class="label text-gray-500">
          Admission Number
        </label>
        <div class="flex items-center gap-x-3">
          <input {...admission_number.as("text")} type="text" class="input" />
          <button
            type="button"
            class="btn-sm"
            onclick={generate_admission_number}
          >
            <i class="icon-[mdi--rotate-clockwise]"></i>
            <span class="sr-only text-xs">generate</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="email" class="label text-gray-500">Email</label>
        <input
          {...email.as("email")}
          type="email"
          placeholder="johndoe@acme.com"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="address" class="label text-gray-500">Address</label>
        <input
          {...address.as("text")}
          type="text"
          placeholder="2 Wise lane"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_date" class="label text-gray-500">
          Admission Date
        </label>
        <input {...admission_date.as("date")} type="date" class="input" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="phone_number" class="label text-gray-500">
          Phone Number
        </label>
        <input
          {...phone_number.as("tel")}
          type="tel"
          placeholder="+232-99-456-890"
          class="input"
        />
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

<script lang="ts">
  import { toast } from "svelte-sonner";
  import { page } from "$app/state";
  import { add_student } from "../students.remote";

  let admission_number = $state("");

  $effect(() => {
    if (add_student.result?.message) {
      toast.info(add_student.result.message);
    }
  });

  $inspect(add_student.issues);

  /** generate a random admission number */
  function generate_admission_number() {
    admission_number = Math.random()
      .toString(36)
      .substring(2, 15)
      .toUpperCase();
  }
</script>

<section class="max-w-6xl">
  <form {...add_student}>
    <h2 class="mb-6 text-xl">Add new student</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <input type="hidden" value={page.params.school_id} name="school_id" />

      <div class="flex flex-col space-y-2">
        <label for="first_name" class="label text-gray-500">First Name</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          placeholder="John"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="middle_name" class="label text-gray-500">Middle Name</label>
        <input
          id="middle_name"
          type="text"
          name="middle_name"
          placeholder=""
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="last_name" class="label text-gray-500">Last Name</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          placeholder="Doe"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_number" class="label text-gray-500">
          Admission Number
        </label>
        <div class="flex items-center gap-x-3">
          <input
            id="admission_number"
            type="text"
            name="admission_number"
            bind:value={admission_number}
            placeholder=""
            class="input"
          />

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
          id="email"
          type="email"
          name="email"
          placeholder="johndoe@acme.com"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="address" class="label text-gray-500">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          placeholder="2 Wise lane"
          class="input"
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="admission_date" class="label text-gray-500">
          Admission Date
        </label>
        <input
          id="admission_date"
          type="date"
          name="admission_date"
          class="input"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="phone_number" class="label text-gray-500">
          Phone Number
        </label>
        <input
          id="phone_number"
          type="tel"
          name="phone_number"
          placeholder="+232-99-456-890"
          class="input"
          required
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

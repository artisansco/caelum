<script>
import { enhance } from "$app/forms";
import BreadCrumbs from "$lib/components/shared/BreadCrumbs.svelte";
import Button from "$lib/components/shared/Button.svelte";
import Input from "$lib/components/shared/Input.svelte";

export let form;
</script>

<BreadCrumbs>
  <span slot="title">Add New Class</span>
</BreadCrumbs>

<form action="" method="post" class="mx-auto max-w-xl mt-10" use:enhance>
  <fieldset class="grid gap-5">
    <div>
      <label for="">Class Name</label>
      <Input name="name" placeholder="Eg:- One, Two, Three" />
    </div>

    {#if form?.error}
      <small class="text-xs text-red-500">{form?.error}</small>
    {/if}

    <Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit"
      >Add Class</Button
    >
  </fieldset>
</form>

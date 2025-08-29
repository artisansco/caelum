<script>
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import BreadCrumbs from "$lib/components/shared/BreadCrumbs.svelte";
  import Button from "$lib/components/shared/Button.svelte";
  import Input from "$lib/components/shared/Input.svelte";

  export let data;
  export let form;
</script>

<BreadCrumbs>
  <span slot="title">Edit Class: {data.editClass?.name} </span>
</BreadCrumbs>

<form
  action="?/updateClass"
  method="post"
  class="mx-auto max-w-xl mt-10"
  use:enhance
>
  <fieldset class="grid gap-5">
    <Input type="hidden" name="id" value={data.editClass.id} />
    <div>
      <label for="">Class Name</label>
      <Input
        name="name"
        placeholder="Eg:- One, Two, Three"
        value={data.editClass.name}
      />
    </div>

    <div>
      <label for="">Subjects ({data.editClass.subjects.length})</label>
      <div class="mt-2 grid gap-1 gap-2 indent-xs">
        {#each data.editClass.subjects as subject (subject.id)}
          <form
            action="/classes/edit?/removeSubject"
            method="post"
            class="flex items-center"
            use:enhance
          >
            <Input type="hidden" name="classId" value={data.editClass.id} />
            <Input type="hidden" value={subject.id} name="subject_id" />
            <span class="min-w-40 text-gray-600">{subject.name}</span>
            <Button>
              <Icon
                icon="mdi:trash"
                class="text-lg text-red-300 hover:text-red-500"
              />
            </Button>
          </form>
        {:else}
          <p class="text-sm text-gray-500 italic">
            No Subject added to this class!!
          </p>
        {/each}
      </div>
    </div>

    {#if form?.error}
      <small class="text-xs text-red-500">{form?.error}</small>
    {/if}

    <Button classes="bg-gray-500 text-white text-sm px-6 py-2 rounded w-fit"
      >Update Class</Button
    >
  </fieldset>
</form>

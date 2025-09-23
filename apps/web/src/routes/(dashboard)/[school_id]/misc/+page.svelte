<script lang="ts">
  import { Tabs } from "melt/components";
  import Subjects from "./subjects.svelte";
  import Classes from "./classes.svelte";

  const tab_ids = ["classes", "subjects"];

  let selected_tab = $state(tab_ids[0]);
</script>

<section class="max-w-6xl">
  <div class="w-full">
    <Tabs bind:value={selected_tab}>
      {#snippet children(tabs)}
        <div {...tabs.triggerList} class="space-x-3 mb-10 border-b-2 py-2">
          {#each tab_ids as id}
            <button {...tabs.getTrigger(id)} class="btn-outline capitalize">
              {id}
            </button>
          {/each}
        </div>

        {#if selected_tab === "classes"}
          <div {...tabs.getContent("classes")}>
            <Classes />
          </div>
        {/if}

        {#if selected_tab === "subjects"}
          <div {...tabs.getContent("subjects")}>
            <Subjects />
          </div>
        {/if}
      {/snippet}
    </Tabs>
  </div>
</section>

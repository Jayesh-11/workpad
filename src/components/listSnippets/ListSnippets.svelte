<script lang="ts">
  import transactions from "../../db/transactions.svelte";
  import { generateText, generateHTML } from "@tiptap/core";
  import "./ListSnippets.css";
  import MiniSearch from "minisearch";
  import { StarterKit } from "@tiptap/starter-kit";

  const miniSearch = new MiniSearch({
    fields: ["id", "data"],
    storeFields: ["id", "rawData"],
  });

  let snippets = $state([]);
  let error = $state(null);
  let query = $state("");
  let rawSnippetsTransaction = transactions.getSnippets();

  if (rawSnippetsTransaction) {
    rawSnippetsTransaction.onsuccess = () => {
      //   $inspect(rawSnippetsTransaction);

      if (Array.isArray(rawSnippetsTransaction?.result)) {
        snippets = rawSnippetsTransaction.result.map((snippet) => {
          return {
            ...snippet,
            rawData: generateHTML(snippet.data, [StarterKit]),

            data: generateText(snippet.data, [StarterKit]),
          };
        });
        miniSearch.addAll(snippets);
      }
    };

    if (rawSnippetsTransaction?.onerror) {
      rawSnippetsTransaction.onerror = () => {
        $inspect(rawSnippetsTransaction);
      };
    }
  }

  const results = $derived.by(() => {
    if (!query) return snippets;
    return miniSearch.search(query);
  });
</script>

<section id="center">
  <input type="text" placeholder="Search" bind:value={query} />
  <section class="list-snippets">
    {#if snippets.length === 0}
      <p>No snippets yet.</p>
    {:else}
      {#each results as snippet}
        <div class="snippet-card">
          <h3>{snippet.id}</h3>
          <div>{@html snippet.rawData}</div>
        </div>
      {/each}
    {/if}
  </section>
</section>

<script lang="ts">
  import transactions from "../../db/transactions.svelte";
  import { generateText, generateHTML } from "@tiptap/core";
  import MiniSearch from "minisearch";
  import { StarterKit } from "@tiptap/starter-kit";

  interface Snippet {
    id: string;
    rawData: string;
    data: string;
    createdAt: string;
    updatedAt: string;
  }

  const miniSearch = new MiniSearch({
    fields: ["id", "data"],
    storeFields: ["id", "rawData", "createdAt", "updatedAt"],
  });

  let snippets = $state<Snippet[]>([]);
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
      console.log("snippets", snippets);
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
  <input
    class="search-input"
    type="text"
    placeholder="Search"
    bind:value={query}
  />
  <section class="list-snippets">
    {#if snippets.length === 0}
      <p>No snippets yet.</p>
    {:else}
      {#each results as snippet}
        <div class="snippet-card">
          <div>{@html snippet.rawData}</div>
        </div>
      {/each}
    {/if}
  </section>
</section>

<style>
  .list-snippets {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 850px;
  }

  .snippet-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    border-radius: 0.5rem;
    width: 350px;
  }

  .search-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
</style>

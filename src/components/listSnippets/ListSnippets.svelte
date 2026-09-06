<script lang="ts">
  import transactions from "../../db/transactions.svelte";
  import { generateText, generateHTML } from "@tiptap/core";
  import Document from "@tiptap/extension-document";
  import Text from "@tiptap/extension-text";
  import Paragraph from "@tiptap/extension-paragraph";
  import HardBreak from "@tiptap/extension-hard-break";
  import Heading from "@tiptap/extension-heading";
  import HorizontalRule from "@tiptap/extension-horizontal-rule";
  import { ListItem, BulletList, OrderedList } from "@tiptap/extension-list";
  import "./ListSnippets.css";
  import MiniSearch from "minisearch";
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
            rawData: generateHTML(snippet.data, [
              Document,
              Text,
              Paragraph,
              HardBreak,
              Heading.configure({
                levels: [1, 2, 3],
              }),
              HorizontalRule,
              ListItem,
              BulletList,
              OrderedList,
            ]),
            data: generateText(snippet.data, [
              Document,
              Text,
              Paragraph,
              HardBreak,
              Heading.configure({
                levels: [1, 2, 3],
              }),
              HorizontalRule,
              ListItem,
              BulletList,
              OrderedList,
            ]),
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

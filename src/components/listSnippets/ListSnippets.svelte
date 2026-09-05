<script lang="ts">
  import transactions from "../../db/transactions.svelte";
  import { generateText } from "@tiptap/core";
  import Document from "@tiptap/extension-document";
  import Text from "@tiptap/extension-text";
  import Paragraph from "@tiptap/extension-paragraph";
  import HardBreak from "@tiptap/extension-hard-break";
  import Heading from "@tiptap/extension-heading";
  import HorizontalRule from "@tiptap/extension-horizontal-rule";
  import { ListItem, BulletList, OrderedList } from "@tiptap/extension-list";
  import "./ListSnippets.css";

  let snippets = $state([]);
  let error = $state(null);
  let rawSnippetsTransaction = transactions.getSnippets();

  if (rawSnippetsTransaction) {
    rawSnippetsTransaction.onsuccess = () => {
      //   $inspect(rawSnippetsTransaction);

      if (Array.isArray(rawSnippetsTransaction?.result)) {
        console.log(rawSnippetsTransaction.result);
        snippets = rawSnippetsTransaction.result.map((snippet) => {
          console.log(snippet.data);
          return {
            ...snippet,
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
      }
    };

    if (rawSnippetsTransaction?.onerror) {
      rawSnippetsTransaction.onerror = () => {
        $inspect(rawSnippetsTransaction);
      };
    }
  }
</script>

<section id="center">
  <section class="list-snippets">
    {#if snippets.length === 0}
      <p>No snippets yet.</p>
    {:else}
      {#each snippets as snippet}
        <div class="snippet-card">
          <h3>{snippet.id}</h3>
          <p>{snippet.data}</p>
        </div>
      {/each}
    {/if}
  </section>
</section>

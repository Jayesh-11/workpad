<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import type { AnyFieldApi } from "@tanstack/svelte-form";

  let { field }: { field: AnyFieldApi } = $props();

  let bubbleMenu = $state();
  let element: HTMLElement | null = null;
  let editor: Editor | null = null;

  onMount(() => {
    if (!element) return;
    editor = new Editor({
      element,
      extensions: [StarterKit],
      content: field.state.value,
      onTransaction: ({ editor }) => {
        // Update the state signal to force a re-render
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        field.handleChange(editor.getJSON());
      },
    });
  });
  onDestroy(() => {
    editor?.destroy();
  });
</script>

<div bind:this={element}></div>

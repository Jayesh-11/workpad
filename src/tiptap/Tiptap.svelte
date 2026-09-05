<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import type { AnyFieldApi } from "@tanstack/svelte-form";

  let { field }: { field: AnyFieldApi } = $props();

  let bubbleMenu = $state();
  let element = $state();
  let editorState = $state({ editor: null });

  onMount(() => {
    editorState.editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        BubbleMenu.configure({
          element: bubbleMenu,
        }),
      ],
      content: field.state.value,
      onTransaction: ({ editor }) => {
        // Update the state signal to force a re-render
        editorState = { editor };
      },
      onUpdate: ({ editor }) => {
        field.handleChange(editor.getJSON());
      },
    });
  });
  onDestroy(() => {
    editorState.editor?.destroy();
  });
</script>

<div bind:this={element}></div>

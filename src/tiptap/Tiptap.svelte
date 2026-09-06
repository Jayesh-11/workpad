<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import type { AnyFieldApi } from "@tanstack/svelte-form";
  import Document from "@tiptap/extension-document";
  import Text from "@tiptap/extension-text";
  import Paragraph from "@tiptap/extension-paragraph";
  import HardBreak from "@tiptap/extension-hard-break";
  import Heading from "@tiptap/extension-heading";
  import HorizontalRule from "@tiptap/extension-horizontal-rule";
  import { ListItem, BulletList, OrderedList } from "@tiptap/extension-list";

  let { field }: { field: AnyFieldApi } = $props();

  let bubbleMenu = $state();
  let element: HTMLElement | null = null;
  let editor: Editor | null = null;

  onMount(() => {
    if (!element) return;
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        BubbleMenu.configure({
          element: bubbleMenu,
        }),
        Document,
        Text,
        Paragraph,
        HardBreak,
        Heading,
        HorizontalRule,
        ListItem,
        BulletList,
        OrderedList,
      ],
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

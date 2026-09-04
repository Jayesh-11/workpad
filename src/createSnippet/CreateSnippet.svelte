<script lang="ts">
  import { workpadDB } from "../db/db.svelte";
  import { CREATE_SNIPPET_KEY } from "../consts/constants";

  let dialog: HTMLDialogElement;
  document.addEventListener("keydown", (e) => {
    if (!workpadDB.db || !dialog || dialog.open === true) return;
    if (e.metaKey && e.key === CREATE_SNIPPET_KEY) {
      e.preventDefault();
      e.stopPropagation();
      dialog.showModal();
    }
  });
</script>

<dialog
  bind:this={dialog}
  id="create-snippet-dialog"
  class="create-snippet-dialog"
>
  <section id="center">
    <h2>Create Snippet</h2>
  </section>

  <div class="ticks"></div>

  <section id="next-steps">
    <input type="text" placeholder="Snippet name" />
    <input type="text" placeholder="Snippet description" />
  </section>

  <section class="about-dialog-footer">
    <p><kbd>Esc</kbd> - Close the dialog</p>
  </section>
</dialog>

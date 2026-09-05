<script lang="ts">
  import { workpadDB } from "../db/db.svelte";
  import { CREATE_SNIPPET_KEY } from "../consts/constants";
  import { createForm } from "@tanstack/svelte-form";
  import FieldInfo from "./FieldInfo.svelte";
  import Tiptap from "../tiptap/Tiptap.svelte";
  import "./createSnippet.css";
  import transactions from "../db/transactions.svelte";

  let dialog: HTMLDialogElement;
  document.addEventListener("keydown", (e) => {
    if (!workpadDB.db || !dialog || dialog.open === true) return;
    if (e.metaKey && e.key === CREATE_SNIPPET_KEY) {
      e.preventDefault();
      e.stopPropagation();
      dialog.showModal();
    }
  });

  const form = createForm(() => ({
    defaultValues: {
      data: "",
      isFavorite: false,
    },
    onSubmit: async ({ value }) => {
      transactions.createSnippet({
        data: value.data,
        isFavorite: value.isFavorite,
      });
    },
  }));
</script>

<dialog
  bind:this={dialog}
  id="create-snippet-dialog"
  class="create-snippet-dialog"
>
  <section id="center">
    <h2>Create Snippet</h2>
  </section>

  <section id="next-steps">
    <form
      id="form"
      onsubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="data"
        validators={{
          onChange: ({ value }) =>
            value.length < 3 ? "Not long enough" : undefined,
        }}
      >
        {#snippet children(field)}
          <div>
            <Tiptap {field} />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <form.Field name="isFavorite">
        {#snippet children(field)}
          <div>
            <label for={field.name}>Favorite</label>
            <input
              type="checkbox"
              id={field.name}
              checked={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                field.handleChange(target.checked);
              }}
            />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <div>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {#snippet children({ canSubmit, isSubmitting })}
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Submitting" : "Submit"}
            </button>
          {/snippet}
        </form.Subscribe>
        <button
          type="button"
          id="reset"
          onclick={() => {
            form.reset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  </section>

  <div class="ticks"></div>
  <section class="about-dialog-footer">
    <p><kbd>Esc</kbd> - Close the dialog</p>
  </section>
</dialog>

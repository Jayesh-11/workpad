<script lang="ts">
  import { workpadDB } from "../db/db.svelte";
  import { CREATE_SNIPPET_KEY } from "../consts/constants";
  import { createForm } from "@tanstack/svelte-form";
  import FieldInfo from "./FieldInfo.svelte";
  import Tiptap from "../tiptap/Tiptap.svelte";

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
      name: "",
      data: "",
      isFavorite: false,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value));
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
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 3 ? "Not long enough" : undefined,
          onChangeAsyncDebounceMs: 5000,
          onChangeAsync: async ({ value }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return (
              value.includes("error") && 'No "error" allowed in first name'
            );
          },
        }}
      >
        {#snippet children(field)}
          <div>
            <input
              id={field.name}
              type="text"
              placeholder="Call it something"
              value={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                field.handleChange(target.value);
              }}
            />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <form.Field
        name="data"
        validators={{
          onChange: ({ value }) =>
            value.length < 3 ? "Not long enough" : undefined,
        }}
      >
        {#snippet children(field)}
          <div>
            <textarea
              id={field.name}
              placeholder="Write anything"
              value={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                field.handleChange(target.value);
              }}
            ></textarea>

            <Tiptap />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <form.Field name="isFavorite">
        {#snippet children(field)}
          <div>
            <label for={field.name}>Employed?</label>
            <input
              oninput={() => field.handleChange(!field.state.value)}
              checked={field.state.value}
              onblur={() => field.handleBlur()}
              id={field.name}
              type="checkbox"
            />
          </div>
          {#if field.state.value}
            <form.Field
              name="data"
              validators={{
                onChange: ({ value }) =>
                  value.length === 0
                    ? "If you have a job, you need a title"
                    : null,
              }}
            >
              {#snippet children(field)}
                <div>
                  <label for={field.name}>Data</label>
                  <input
                    type="text"
                    id={field.name}
                    placeholder="Job Title"
                    value={field.state.value}
                    onblur={field.handleBlur}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      field.handleChange(target.value);
                    }}
                  />
                  <FieldInfo {field} />
                </div>
              {/snippet}
            </form.Field>
          {/if}
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

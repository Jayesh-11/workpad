import { nanoid } from "nanoid";
import { STORES as indexStore, workpadDB } from "./db.svelte";

const createSnippet = ({
  data,
  isFavorite = false,
}: {
  data: string;
  isFavorite?: boolean;
}) => {
  if (!workpadDB.db) {
    // toast error, althought we won't we showing this to user
    // but just in case
    return;
  }

  const transaction = workpadDB.db.transaction(
    indexStore.SNIPPETS,
    "readwrite",
  );

  const snippetObjectStore = transaction.objectStore(indexStore.SNIPPETS);
  const snippet = {
    id: nanoid(),
    data,
    isFavorite,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const request = snippetObjectStore.add(snippet);
  request.onsuccess = () => {
    // close modal
  };

  request.onerror = () => {
    // rollback + notify + don't close modal
  };
};

const getSnippets = () => {
  if (!workpadDB.db) {
    return;
  }
  const transaction = workpadDB.db.transaction(indexStore.SNIPPETS, "readonly");
  const snippetObjectStore = transaction.objectStore(indexStore.SNIPPETS);
  const request = snippetObjectStore.getAll();
  return request;
};

export default { createSnippet, getSnippets };

export enum ERROR_CODES {
  INDEXEDDB_NOT_SUPPORTED = "IndexedDB is not supported by browser",
  UNABLE_TO_OPEN_DATABASE = "Unable to open database",
}

export const STORES = {
  SNIPPETS: "snippets",
};

const SNIPPETS_STORE_INDEXES = {
  name: {
    indexName: "name_idx",
    keyPath: "name",
  },
  // for assets (images, videos, etc.)
  // data: {
  //   indexName: "data_idx",
  //   keyPath: "data",
  // },
  isFavorite: {
    indexName: "isFavorite_idx",
    keyPath: "isFavorite",
  },
  createdAt: {
    indexName: "createdAt_idx",
    keyPath: "createdAt",
  },
  updatedAt: {
    indexName: "updatedAt_idx",
    keyPath: "updatedAt",
  },
};

const createStoreIfNotExists = (
  db: IDBDatabase,
  storeName: string,
): IDBObjectStore => {
  if (!db.objectStoreNames.contains(storeName)) {
    return db.createObjectStore(storeName, {
      keyPath: "id",
    });
  }
  return db.transaction(storeName, "readwrite").objectStore(storeName);
};

const createIndexIfNotExists = (
  objectStore: IDBObjectStore,
  index: { indexName: string; keyPath: string },
) => {
  if (!objectStore) {
    throw new Error("Object store not found");
  }
  if (objectStore.indexNames.contains(index.indexName)) {
    return;
  }
  objectStore.createIndex(index.indexName, index.keyPath);
};

const initializeSnippetsStore = (db: IDBDatabase) => {
  // version 0
  const snippetsStore = db.createObjectStore(STORES.SNIPPETS, {
    keyPath: "id",
  });
  snippetsStore.createIndex(
    SNIPPETS_STORE_INDEXES.name.indexName,
    SNIPPETS_STORE_INDEXES.name.keyPath,
  );
  snippetsStore.createIndex(
    SNIPPETS_STORE_INDEXES.isFavorite.indexName,
    SNIPPETS_STORE_INDEXES.isFavorite.keyPath,
  );
  snippetsStore.createIndex(
    SNIPPETS_STORE_INDEXES.createdAt.indexName,
    SNIPPETS_STORE_INDEXES.createdAt.keyPath,
  );
  snippetsStore.createIndex(
    SNIPPETS_STORE_INDEXES.updatedAt.indexName,
    SNIPPETS_STORE_INDEXES.updatedAt.keyPath,
  );
};

class WorkpadDB {
  db: IDBDatabase | null = $state(null);
  error: string | null = $state(null);

  constructor(name: string, version: number) {
    if (this.db) {
      console.log("Database already opened");
      return;
    }

    if (!window.indexedDB) {
      this.error = ERROR_CODES.INDEXEDDB_NOT_SUPPORTED;
      return;
    }

    const openRequest = window.indexedDB.open(name, version);

    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const oldVersion = event.oldVersion;
      const db = openRequest.result;

      let snippetsStore: IDBObjectStore | null = null;
      switch (oldVersion) {
        case 0:
          initializeSnippetsStore(db);
          break;
        default:
          // version mismatch

          snippetsStore = createStoreIfNotExists(db, STORES.SNIPPETS);
          createIndexIfNotExists(snippetsStore, SNIPPETS_STORE_INDEXES.name);
          createIndexIfNotExists(
            snippetsStore,
            SNIPPETS_STORE_INDEXES.isFavorite,
          );
          createIndexIfNotExists(
            snippetsStore,
            SNIPPETS_STORE_INDEXES.createdAt,
          );
          createIndexIfNotExists(
            snippetsStore,
            SNIPPETS_STORE_INDEXES.updatedAt,
          );
          break;
      }
    };

    openRequest.onerror = () => {
      this.error =
        openRequest.error?.message ?? ERROR_CODES.UNABLE_TO_OPEN_DATABASE;
    };

    openRequest.onsuccess = () => {
      if (this.db) return;

      this.db = openRequest.result;

      this.db.onversionchange = () => {
        if (!this.db) return;
        this.db.close();
        alert("Database is outdated, please reload the page.");
      };
    };
  }
}

export const workpadDB = new WorkpadDB("workpad", 1);

import { Storage, StorageAPI } from '@graphiql/toolkit';
import { ReactNode, useContext, createContext, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

export const StorageContext = createContext<StoreApi<StorageState> | null>(
  null,
);

export type StorageContextProviderProps = {
  children: ReactNode;
  /**
   * Provide a custom storage API.
   * @default `localStorage`
   * @see {@link https://graphiql-test.netlify.app/typedoc/modules/graphiql_toolkit.html#storage-2|API docs}
   * for details on the required interface.
   */
  storage?: Storage;
};

type StorageState = {
  storage: StorageAPI;
};

export function StorageContextProvider({
  children,
  storage,
}: StorageContextProviderProps) {
  const [store] = useState(() =>
    createStore<StorageState>(() => ({
      storage: new StorageAPI(storage),
    })),
  );

  return (
    <StorageContext.Provider value={store}>{children}</StorageContext.Provider>
  );
}

function useStorageStore<T>(selector: (state: StorageState) => T) {
  const store = useContext(StorageContext);
  if (!store) {
    throw new Error('Missing StorageContext.Provider');
  }
  return useStore(store, selector);
}

export const useStorage = () => useStorageStore(state => state.storage);

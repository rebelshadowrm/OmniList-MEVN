import { defineStore } from 'pinia'
import type { LibraryEntry } from '../types/contracts'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    itemsByKey: {} as Record<string, LibraryEntry>,
  }),
  actions: {
    setItem(key: string, value: LibraryEntry) {
      this.itemsByKey[key] = value
    },
    removeItem(key: string) {
      delete this.itemsByKey[key]
    },
    clear() {
      this.itemsByKey = {}
    },
  },
})

import { defineStore } from 'pinia'
import type { ThreadRecord } from '../types/contracts'

export const useThreadStore = defineStore('thread', {
  state: () => ({
    itemsByKey: {} as Record<string, ThreadRecord[]>,
  }),
  actions: {
    setThreads(key: string, value: ThreadRecord[]) {
      this.itemsByKey[key] = value ?? []
    },
    clear() {
      this.itemsByKey = {}
    },
  },
})

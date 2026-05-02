import { defineStore } from 'pinia'
import type { HomePreferences } from '../types/contracts'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    homePreferences: null as HomePreferences | null,
  }),
  actions: {
    setHomePreferences(preferences: HomePreferences | null) {
      this.homePreferences = preferences
    },
  },
})

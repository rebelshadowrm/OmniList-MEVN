import { defineStore } from 'pinia'
import type { ThemeColors } from '../types/contracts'

export interface ThemeState {
  colors: ThemeColors
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    colors: {},
  }),
  actions: {
    setThemeState(colors: ThemeColors) {
      this.colors = colors ?? {}
    },
    clearThemeState() {
      this.colors = {}
    },
  },
})

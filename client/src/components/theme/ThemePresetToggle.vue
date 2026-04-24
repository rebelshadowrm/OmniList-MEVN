<template>
  <div class="theme-presets" :class="{compact}">
    <span v-if="label" class="preset-label">{{ label }}</span>
    <div class="preset-buttons">
      <button v-for="preset in presets"
              :key="preset.name"
              type="button"
              :aria-pressed="isActive(preset)"
              @click="selectPreset(preset)">
        <span class="swatches" aria-hidden="true">
          <span :style="{background: preset.colors.primaryColor}"></span>
        </span>
        <span>{{ preset.name }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import useTheme from "../../composables/theme"
import {THEME_PRESETS} from "../../config/homePreferences"

export default {
  name: "ThemePresetToggle",
  props: {
    label: {
      type: String,
      default: 'Theme',
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      presets: THEME_PRESETS,
      themeState: null,
    }
  },
  created() {
    const {getTheme} = useTheme()
    this.themeState = getTheme()
  },
  methods: {
    selectPreset(preset) {
      const {setTheme, applyTheme} = useTheme()
      setTheme(preset.colors)
      applyTheme(preset.colors)
    },
    isActive(preset) {
      const theme = this.themeState?.value ?? this.themeState
      return theme?.primaryColor === preset.colors.primaryColor
          && theme?.paletteMode === preset.colors.paletteMode
    },
  },
}
</script>

<style scoped>
.theme-presets {
  display: grid;
  gap: .5rem;
}

.preset-label {
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 800;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

button {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: .35rem .55rem;
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  cursor: pointer;
}

button[aria-pressed="true"] {
  border-color: var(--clr-primary-200);
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
  font-weight: 800;
}

.swatches {
  display: inline-grid;
  grid-auto-flow: column;
  gap: .15rem;
}

.swatches span {
  width: .85rem;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid hsl(var(--clr-black) / .3);
}

.compact {
  grid-template-columns: max-content 1fr;
  align-items: center;
}

.compact .preset-buttons {
  gap: .35rem;
}

.compact button {
  padding: .25rem .45rem;
  font-size: var(--txt-small);
}

@media (max-width: 42rem) {
  .compact {
    grid-template-columns: 1fr;
  }
}
</style>

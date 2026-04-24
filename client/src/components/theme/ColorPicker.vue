<template>
  <section class="theme-settings">
    <div class="section-heading">
      <h2>Theme</h2>
      <button class="save-btn" type="button" @click="saveTheme">
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>

    <div class="mode-toggle" role="tablist" aria-label="Theme mode">
      <button
          type="button"
          :class="{active: mode === 'basic'}"
          @click="setMode('basic')">
        Basic
      </button>
      <button
          type="button"
          :class="{active: mode === 'advanced'}"
          @click="setMode('advanced')">
        Advanced
      </button>
    </div>

    <div v-if="mode === 'basic'" class="basic-editor">
      <div class="preview" :style="basicPreviewStyle">
        <span>Hue {{ basicHue }}deg</span>
      </div>

      <label for="palette-mode">
        <span>Auto Palette</span>
      </label>
      <select
          id="palette-mode"
          v-model="paletteMode"
          @change="applyBasicColor">
        <option
            v-for="option in paletteOptions"
            :key="option.key"
            :value="option.key">
          {{ option.label }}
        </option>
      </select>

      <label for="theme-hue">
        <span>Hue</span>
        <output>{{ basicHue }}deg</output>
      </label>
      <input
          id="theme-hue"
          v-model.number="basicHue"
          type="range"
          min="0"
          max="359"
          @input="applyBasicColor">
    </div>

    <div v-if="mode === 'advanced'" class="swatches" role="tablist" aria-label="Theme colors">
      <button
          v-for="option in colorOptions"
          :key="option.key"
          class="swatch-btn"
          :class="{active: activeColor === option.key, unset: isUnset(option.key)}"
          :style="swatchStyle(option.key)"
          role="tab"
          type="button"
          :aria-selected="activeColor === option.key"
          @click="activeColor = option.key">
        <span>{{ option.label }}</span>
      </button>
    </div>

    <div v-if="mode === 'advanced'" class="editor">
      <div class="preview" :class="{unset: isUnset(activeColor)}" :style="activePreviewStyle">
        <span>{{ activeOption.label }}</span>
      </div>

      <div class="controls">
        <label :for="`${activeColor}-hue`">
          <span>Hue</span>
          <output>{{ activeControls.hue }}deg</output>
        </label>
        <input
            :id="`${activeColor}-hue`"
            v-model.number="activeControls.hue"
            type="range"
            min="0"
            max="359"
            @input="applyActiveColor">

        <label :for="`${activeColor}-chroma`">
          <span>Chroma</span>
          <output>{{ activeControls.chroma.toFixed(3) }}</output>
        </label>
        <input
            :id="`${activeColor}-chroma`"
            v-model.number="activeControls.chroma"
            type="range"
            min="0.02"
            max="0.24"
            step="0.005"
            @input="applyActiveColor">
      </div>

      <div class="actions">
        <button class="ghost-btn" type="button" @click="resetActive">
          <i class="fas fa-undo"></i>
          Reset
        </button>
        <button
            v-if="activeColor !== 'primaryColor'"
            class="ghost-btn"
            type="button"
            @click="unsetActive">
          <i class="fas fa-times"></i>
          Unset
        </button>
      </div>
    </div>

    <div class="theme-preview">
      <div class="preview-strip primary-strip"></div>
      <div class="preview-strip secondary-strip"></div>
      <div class="preview-strip accent-strip"></div>
      <div class="preview-surface">
        <h3>Preview</h3>
        <p>OmniList profile theme</p>
        <button type="button">Action</button>
      </div>
    </div>
  </section>
</template>

<script>
import useTheme from "../../composables/theme.js"
import useUser from "../../composables/user.js"
import UserService from "../../services/UserService";
import TokenService from "../../services/TokenService";

const DEFAULTS = {
  mode: 'basic',
  paletteMode: 'original',
  primaryColor: '#e85e30',
  secondaryColor: '',
  accentColor: ''
}

const BASIC_CHROMA = .13
const THEME_LIGHTNESS = 62

const COLOR_OPTIONS = [
  {key: 'primaryColor', label: 'Primary', css: 'primary'},
  {key: 'secondaryColor', label: 'Secondary', css: 'secondary'},
  {key: 'accentColor', label: 'Accent', css: 'accent'},
]

const PALETTE_OPTIONS = [
  {key: 'original', label: 'Original'},
  {key: 'true', label: 'True Complement'},
  {key: 'split', label: 'Split Complement'},
  {key: 'triadic', label: 'Triadic'},
]

export default {
  name: "ColorPicker",
  emits: ['saved'],
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      mode: 'basic',
      paletteMode: 'original',
      activeColor: 'primaryColor',
      basicHue: 14,
      colorOptions: COLOR_OPTIONS,
      paletteOptions: PALETTE_OPTIONS,
      colors: {...DEFAULTS},
      controls: {
        primaryColor: {hue: 14, chroma: BASIC_CHROMA},
        secondaryColor: {hue: 104, chroma: BASIC_CHROMA},
        accentColor: {hue: 284, chroma: BASIC_CHROMA},
      },
      userState: null,
      message: ''
    }
  },
  computed: {
    activeOption() {
      return this.colorOptions.find(({key}) => key === this.activeColor)
    },
    activeControls() {
      return this.controls[this.activeColor]
    },
    activePreviewStyle() {
      return {
        '--preview-hue': `${this.activeControls.hue}deg`,
        '--preview-chroma': this.activeControls.chroma,
      }
    },
    basicPreviewStyle() {
      return {
        '--preview-hue': `${this.basicHue}deg`,
        '--preview-chroma': BASIC_CHROMA,
      }
    },
  },
  watch: {
    user() {
      this.loadColors()
    },
  },
  async created() {
    await this.resolveUser()
    this.loadColors()
  },
  methods: {
    async resolveUser() {
      const {getUser, initializeUser, decodeJWT, setUser} = useUser()
      await initializeUser()
      this.userState = getUser()

      const userState = this.userState?.value ?? this.userState
      let user = this.user ?? userState?.user
      if (user?._id) return user

      const {_id} = decodeJWT(TokenService.getAccessToken())?.user ?? {}
      if (!_id) return null

      const res = await UserService.getUser(_id)
      if (res?.status !== 200) return null

      setUser(res.data)
      this.userState = getUser()
      return res.data
    },
    loadColors() {
      const {getLocalColors, HexToOKLCH} = useTheme()
      const userState = this.userState?.value ?? this.userState
      const user = this.user ?? userState?.user
      const userColors = user?.userPreferences?.themes?.profileTheme
      const localColors = getLocalColors()
      this.paletteMode = userColors?.paletteMode ?? localColors?.paletteMode ?? DEFAULTS.paletteMode
      this.colors = {
        primaryColor: userColors?.primaryColor ?? localColors?.primaryColor ?? DEFAULTS.primaryColor,
        secondaryColor: userColors?.secondaryColor ?? localColors?.secondaryColor ?? DEFAULTS.secondaryColor,
        accentColor: userColors?.accentColor ?? localColors?.accentColor ?? DEFAULTS.accentColor,
      }

      this.colorOptions.forEach(({key}) => {
        const color = this.colors[key] || DEFAULTS[key] || DEFAULTS.primaryColor
        const oklch = HexToOKLCH(color)
        this.controls[key] = {
          hue: oklch.hue,
          chroma: oklch.chroma,
        }
      })
      this.basicHue = this.controls.primaryColor.hue
      this.mode = (userColors?.mode ?? localColors?.mode) === 'advanced' ? 'advanced' : 'basic'
      if (this.mode === 'basic') {
        this.applyBasicColor()
      } else {
        this.applyAllColors()
      }
    },
    setMode(mode) {
      this.mode = mode
      if (mode === 'basic') {
        this.applyBasicColor()
      } else {
        this.applyAllColors()
      }
      this.message = ''
    },
    applyBasicColor() {
      const {setTheme, setPrimaryColor, setAutoPalette, OKLCHToHex} = useTheme()
      const color = {
        hue: this.basicHue,
        chroma: BASIC_CHROMA,
      }
      const primaryColor = OKLCHToHex(THEME_LIGHTNESS, color.chroma, color.hue)

      this.colors = {
        primaryColor,
        secondaryColor: '',
        accentColor: '',
      }
      this.controls.primaryColor = color

      document.documentElement.style.removeProperty('--clr-secondary-h')
      document.documentElement.style.removeProperty('--clr-secondary-s')
      document.documentElement.style.removeProperty('--clr-secondary-c')
      document.documentElement.style.removeProperty('--clr-accent-h')
      document.documentElement.style.removeProperty('--clr-accent-s')
      document.documentElement.style.removeProperty('--clr-accent-c')
      setAutoPalette(this.paletteMode)
      setPrimaryColor(color)
      setTheme({
        mode: this.mode,
        paletteMode: this.paletteMode,
        ...this.colors,
      })
    },
    applyColor(key) {
      const {setTheme, setPrimaryColor, setSecondaryColor, setAccentColor} = useTheme()
      const value = this.colors[key]
      const color = this.controls[key]

      if (!value && key !== 'primaryColor') {
        if (key === 'secondaryColor') {
          document.documentElement.style.removeProperty('--clr-secondary-h')
          document.documentElement.style.removeProperty('--clr-secondary-s')
          document.documentElement.style.removeProperty('--clr-secondary-c')
        }
        if (key === 'accentColor') {
          document.documentElement.style.removeProperty('--clr-accent-h')
          document.documentElement.style.removeProperty('--clr-accent-s')
          document.documentElement.style.removeProperty('--clr-accent-c')
        }
        setTheme({
          mode: this.mode,
          paletteMode: this.paletteMode,
          [key]: '',
        })
        return
      }

      if (key === 'primaryColor') setPrimaryColor(color)
      if (key === 'secondaryColor') setSecondaryColor(color)
      if (key === 'accentColor') setAccentColor(color)
      setTheme({
        mode: this.mode,
        paletteMode: this.paletteMode,
        [key]: value,
      })
    },
    applyAllColors() {
      this.colorOptions.forEach(({key}) => this.applyColor(key))
    },
    applyActiveColor() {
      const {OKLCHToHex} = useTheme()
      this.colors[this.activeColor] = OKLCHToHex(
          THEME_LIGHTNESS,
          this.activeControls.chroma,
          this.activeControls.hue
      )
      this.applyColor(this.activeColor)
      this.message = ''
    },
    swatchStyle(key) {
      if (this.isUnset(key)) return {}

      const controls = this.controls[key]
      return {
        '--swatch-hue': `${controls.hue}deg`,
        '--swatch-chroma': controls.chroma,
      }
    },
    isUnset(key) {
      return key !== 'primaryColor' && !this.colors[key]
    },
    resetActive() {
      const {HexToOKLCH} = useTheme()
      this.colors[this.activeColor] = DEFAULTS[this.activeColor] || DEFAULTS.primaryColor
      const oklch = HexToOKLCH(this.colors[this.activeColor] || DEFAULTS.primaryColor)
      this.controls[this.activeColor] = {
        hue: oklch.hue,
        chroma: oklch.chroma,
      }
      this.applyColor(this.activeColor)
      this.message = ''
    },
    unsetActive() {
      this.colors[this.activeColor] = ''
      this.applyColor(this.activeColor)
      this.message = ''
    },
    async saveTheme() {
      this.message = 'Saving theme...'
      const user = await this.resolveUser()
      if (!user?._id) {
        this.message = 'Theme could not be saved because no user is loaded.'
        return
      }

      const data = {
        userPreferences: {
          themes: {
            profileTheme: {
              mode: this.mode,
              paletteMode: this.paletteMode,
              primaryColor: this.colors.primaryColor || DEFAULTS.primaryColor,
              secondaryColor: this.mode === 'basic' ? '' : this.colors.secondaryColor,
              accentColor: this.mode === 'basic' ? '' : this.colors.accentColor
            }
          }
        }
      }

      const res = await UserService.updateUser(user._id, data)
      if (res?.status === 200) {
        const freshUser = await UserService.getUser(user._id)
        const savedUser = freshUser?.status === 200 ? freshUser.data : res.data
        const {setUser} = useUser()
        const {setTheme, applyTheme} = useTheme()
        const colors = savedUser?.userPreferences?.themes?.profileTheme
        setUser(savedUser)
        setTheme(colors)
        applyTheme(colors)
        this.$emit('saved', savedUser)
        this.message = JSON.stringify(colors) === JSON.stringify(data.userPreferences.themes.profileTheme)
            ? 'Theme saved.'
            : 'Theme did not persist. Please try saving again.'
      } else {
        this.message = res?.data ?? 'Theme could not be saved.'
      }
    },
  }
}
</script>

<style scoped>
.theme-settings {
  display: grid;
  gap: 1rem;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h2,
h3,
p {
  margin: 0;
}

.message {
  color: var(--clr-primary-200);
  font-weight: 600;
}

.mode-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .5rem;
}

.mode-toggle button {
  padding: .4rem .65rem;
  background: transparent;
  color: var(--clr-text);
  font-weight: 700;
}

.mode-toggle button.active {
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
}

.basic-editor {
  display: grid;
  gap: 1rem;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .75rem;
}

.swatch-btn {
  min-height: 4.25rem;
  padding: .6rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  color: hsl(var(--clr-white-200));
  background:
      linear-gradient(
          135deg,
          oklch(35% var(--swatch-chroma) var(--swatch-hue)),
          oklch(68% var(--swatch-chroma) var(--swatch-hue))
      );
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.swatch-btn.active {
  outline: 2px solid var(--clr-primary-200);
  outline-offset: 2px;
}

.swatch-btn.unset {
  color: var(--clr-text);
  background-color: hsl(var(--clr-white) / .08);
  background-image:
      linear-gradient(45deg, hsl(var(--clr-white) / .16) 25%, transparent 25%),
      linear-gradient(-45deg, hsl(var(--clr-white) / .16) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, hsl(var(--clr-white) / .16) 75%),
      linear-gradient(-45deg, transparent 75%, hsl(var(--clr-white) / .16) 75%);
  background-position: 0 0, 0 .5rem, .5rem -.5rem, -.5rem 0;
  background-size: 1rem 1rem;
}

.editor {
  display: grid;
  gap: 1rem;
}

.preview {
  min-height: 7rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  color: hsl(var(--clr-white-200));
  background:
      linear-gradient(
          140deg,
          oklch(28% var(--preview-chroma) var(--preview-hue)),
          oklch(66% var(--preview-chroma) var(--preview-hue))
      );
  border: 1px solid var(--clr-border);
  font-size: var(--txt-lrg);
  font-weight: 800;
}

.preview.unset {
  color: var(--clr-text);
  background-color: hsl(var(--clr-white) / .08);
  background-image:
      linear-gradient(45deg, hsl(var(--clr-white) / .14) 25%, transparent 25%),
      linear-gradient(-45deg, hsl(var(--clr-white) / .14) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, hsl(var(--clr-white) / .14) 75%),
      linear-gradient(-45deg, transparent 75%, hsl(var(--clr-white) / .14) 75%);
  background-position: 0 0, 0 .75rem, .75rem -.75rem, -.75rem 0;
  background-size: 1.5rem 1.5rem;
}

.controls {
  display: grid;
  gap: .65rem;
}

label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: var(--txt-small);
  font-weight: 700;
}

output {
  font-family: var(--ff-mono);
  color: var(--clr-primary-200);
}

input[type=range] {
  width: 100%;
  accent-color: var(--clr-primary-400);
}

select {
  min-height: 2.25rem;
  padding: .35rem .55rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  color: var(--clr-text);
  background: var(--clr-bg);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--clr-border);
  cursor: pointer;
}

.save-btn {
  padding: .35rem .75rem;
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 700;
}

.ghost-btn {
  padding: .35rem .65rem;
  color: var(--clr-text);
  background: transparent;
}

.ghost-btn:hover,
.save-btn:hover {
  background-color: var(--clr-secondary-800-5);
}

.theme-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.preview-strip {
  min-height: .55rem;
}

.primary-strip {
  background: var(--clr-primary-400);
}

.secondary-strip {
  background: var(--clr-secondary-400);
}

.accent-strip {
  background: var(--clr-accent-400);
}

.preview-surface {
  grid-column: 1 / -1;
  display: grid;
  gap: .5rem;
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

.preview-surface button {
  width: max-content;
  padding: .35rem .75rem;
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  font-weight: 700;
}

@media (max-width: 42rem) {
  .swatches {
    grid-template-columns: 1fr;
  }
}
</style>

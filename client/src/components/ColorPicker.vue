<template>
  <div class="color-pickers">
    <div class="color-picker">
      <input :data-id="user?.user?._id"
             type="color"
             data-type="primaryColor"
             v-model="primaryColor"
             @input="colorOnChange"
             @blur="dbSetColor"
             name="primaryColor"
             id="primaryColor">
      <h2 class="primaryColor">Primary Color</h2>
    </div>
    <button class="more-options-btn"
            @click="optionalColors = !optionalColors">more color options</button>
    <div v-if="optionalColors" class="optional-colors">
      <div class="color-picker">
        <input :data-id="user?.user?._id"
               type="color"
               data-type="secondaryColor"
               v-model="secondaryColor"
               @input="colorOnChange"
               @blur="dbSetColor"
               name="secondaryColor"
               id="secondaryColor">
        <h2 class="secondaryColor">Secondary Color</h2>
        <button class="unset-btn"
                @click="unsetColor"
                :data-id="user?.user?._id"
                data-type="secondaryColor">reset</button>
      </div>
      <div class="color-picker">
        <input :data-id="user?.user?._id"
               type="color"
               data-type="accentColor"
               v-model="accentColor"
               @input="colorOnChange"
               @blur="dbSetColor"
               name="accentColor"
               id="accentColor">
        <h2 class="accentColor">Accent Color</h2>
        <button class="unset-btn"
                @click="unsetColor"
                :data-id="user?.user?._id"
                data-type="accentColor">reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import useTheme from "../composables/theme.js"
import useUser from '../composables/user.js'
import UserService from "../services/UserService";

export default {
  name: "ColorPicker",
  data() {
    return {
      primaryColor: '#ff0000',
      secondaryColor: '#000000',
      accentColor: '#000000',
      optionalColors: false,
      user: {}
    }
  },
  created() {
    const {getUser} = useUser()
    this.user = getUser()
    const {getLocalColors} = useTheme()
    const colors = getLocalColors()

    const primary = colors?.primaryColor ?? '#ff0000'
    this.primaryColor = primary.length > 0 ? primary : '#ff0000'

    const secondary = colors?.secondaryColor ?? '#000000'
    this.secondaryColor = secondary.length > 0 ? secondary : '#000000'

    const accent = colors?.accentColor ?? '#000000'
    this.accentColor = accent.length > 0 ? accent : '#000000'
  },
  methods: {
    async dbSetColor(e) {
      const id = e?.target?.dataset?.id
      const type = e?.target?.dataset?.type
      const {getLocalColors} = useTheme()
      const localColors = getLocalColors()
      const color = {
        primaryColor: localColors?.primaryColor,
        secondaryColor: localColors?.secondaryColor,
        accentColor: localColors?.accentColor
      }
      if(type === 'primaryColor') color.primaryColor = this.primaryColor
      if(type === 'secondaryColor') color.secondaryColor = this.secondaryColor
      if(type === 'accentColor') color.accentColor = this.accentColor
      const data = {
        userPreferences: {
          themes: {
            profileTheme: color
            }
          }
        }
      try {
        const res = await UserService.updateUser(id, data)
        console.log(res)
      } catch(err) {
        console.log(err)
      }
    },
    async setColor(id, colors) {
      try {
        const data = {
          userPreferences: {
            themes: {
              profileTheme: colors
            }
          }
        }
        const res = await UserService.updateUser(id, data)
        console.log(res)
      } catch(err) {
        console.log(err)
      }
    },
    colorOnChange(e) {
      const {HexToHSL, setPrimaryColor, setSecondaryColor,
            setAccentColor, setTheme} = useTheme()
      const color = HexToHSL(e.target.value)
      const type = e.target.dataset.type
      const value = e.target.value
      if(type === 'primaryColor') setPrimaryColor(color)
      if(type === 'secondaryColor') setSecondaryColor(color)
      if(type === 'accentColor') setAccentColor(color)
      const clr = {
        [type]: value
      }
      setTheme(clr)
    },
    async unsetColor(e) {
      console.log(e.target)
      const {getLocalColors, setTheme} = useTheme()
      const type = e?.target?.dataset?.type
      const id = e?.target?.dataset?.id
      const color = getLocalColors()
      if(type === 'secondaryColor') {
        color.secondaryColor = ''
        this.secondaryColor = '#000000'
        document.documentElement.style.removeProperty('--clr-secondary-h')
        document.documentElement.style.removeProperty('--clr-secondary-s')
      }
      if(type === 'accentColor') {
        color.accentColor = ''
        this.accentColor = '#000000'
        document.documentElement.style.removeProperty('--clr-accent-h')
        document.documentElement.style.removeProperty('--clr-accent-s')
      }
      setTheme(color)
      await this.setColor(id, color)
    },
  }
}
</script>

<style scoped>
button {
  user-select: none;
  max-width: max-content;
  color: var(--clr-text);
  cursor: pointer;
  border-radius: 10px;
  border-color: var(--clr-border);
}
.more-options-btn {
  font-weight: 600;
  background-color: var(--clr-accent-800-3);
  padding: .4rem .75rem;
}
.unset-btn {
  text-transform: capitalize;
  background-color: var(--clr-bg);
}
.unset-btn:hover {
  color: var(--clr-primary-200);
  background-color: hsl(0deg 0% 100% / .1);
}
.color-pickers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.optional-colors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}
.color-picker {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
.primaryColor {
  color: var(--clr-primary-400);
}
.secondaryColor {
  color: var(--clr-secondary-400);
}
.accentColor {
  color: var(--clr-accent-400);
}
</style>
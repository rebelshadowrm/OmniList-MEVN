<template>
  <div class="color-pickers">
    <div class="color-picker">
      <input type="color"
             data-type="primaryColor"
             v-model="primaryColor"
             @input="colorOnChange"
             name="primaryColor"
             id="primaryColor">
      <h2 class="primaryColor">Primary Color</h2>
    </div>
    <button class="more-options-btn" @click="optionalColors = !optionalColors">more color options</button>
    <div v-if="optionalColors" class="optional-colors">
      <div class="color-picker">
        <input type="color"
               data-type="secondaryColor"
               v-model="secondaryColor"
               @input="colorOnChange"
               name="secondaryColor"
               id="secondaryColor">
        <h2 class="secondaryColor">Secondary Color</h2>
        <button class="unset-btn" @click="unsetColor" data-type="secondaryColor">reset</button>
      </div>
      <div class="color-picker">
        <input type="color"
               data-type="accentColor"
               v-model="accentColor"
               @input="colorOnChange"
               name="accentColor"
               id="accentColor">
        <h2 class="accentColor">Accent Color</h2>
        <button class="unset-btn" @click="unsetColor" data-type="accentColor">reset</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileColorPicker",
  data() {
    return {
      primaryColor: '#000000',
      secondaryColor: '#000000',
      accentColor: '#000000',
      optionalColors: false,
    }
  },
  created() {
    const colors = this.getColor()
    this.primaryColor = colors?.primaryColor ?? '#ff0000'
    this.secondaryColor = colors?.secondaryColor ?? '#000000'
    this.accentColor = colors?.accentColor ?? '#000000'
    const primaryHSL = this.HexToHSL(colors?.primaryColor ?? '#ff0000')
    this.setPrimaryColor(primaryHSL)
    if(colors?.secondaryColor) {
      const secondaryHSL = this.HexToHSL(colors.secondaryColor)
      this.setSecondaryColor(secondaryHSL)
    }
    if(colors?.accentColor) {
      const accentHSL = this.HexToHSL(colors.accentColor)
      this.setAccentColor(accentHSL)
    }
  },
  methods: {
    setColor(clr) {
      const color = this.getColor()
      if(color) {
        color.primaryColor = clr?.primaryColor ?? color.primaryColor
        color.secondaryColor = clr?.secondaryColor ?? color.secondaryColor
        color.accentColor = clr?.accentColor ?? color.accentColor
        localStorage.setItem("color", JSON.stringify(color))
      } else {
        const newColor = {
          primaryColor: clr?.primaryColor ?? '#ff0000',
          secondaryColor: clr?.secondaryColor,
          accentColor: clr?.accentColor
        }
        localStorage.setItem('color', JSON.stringify(newColor))
      }
    },
    getColor() {
      return JSON.parse(localStorage.getItem("color"))
    },
    colorOnChange(e) {
      const color = this.HexToHSL(e.target.value)
      const type = e.target.dataset.type
      const value = e.target.value
      if(type === 'primaryColor') this.setPrimaryColor(color)
      if(type === 'secondaryColor') this.setSecondaryColor(color)
      if(type === 'accentColor') this.setAccentColor(color)
      const clr = {
        [type]: value
      }
      this.setColor(clr)
    },
    setPrimaryColor(color) {
      document.documentElement.style.setProperty('--clr-primary-h', `${color.hue}deg`)
      document.documentElement.style.setProperty('--clr-primary-s', `${color.saturation}%`)
    },
    setSecondaryColor(color) {
      document.documentElement.style.setProperty('--clr-secondary-h', `${color.hue}deg`)
      document.documentElement.style.setProperty('--clr-secondary-s', `${color.saturation}%`)
    },
    setAccentColor(color) {
      document.documentElement.style.setProperty('--clr-accent-h', `${color.hue}deg`)
      document.documentElement.style.setProperty('--clr-accent-s', `${color.saturation}%`)
    },
    unsetColor(e) {
      const type = e.target.dataset.type
      const color = this.getColor()
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
      this.setColor(color)
    },
    HexToHSL(H) {
      // Convert hex to RGB first
      let r = 0, g = 0, b = 0
      if (H.length == 4) {
        r = `0x${H[1]}${H[1]}`
        g = `0x${H[2]}${H[2]}`
        b = `0x${H[3]}${H[3]}`
      } else if (H.length == 7) {
        r = `0x${H[1]}${H[2]}`
        g = `0x${H[3]}${H[4]}`
        b = `0x${H[5]}${H[6]}`
      }
      // Then to HSL
      r /= 255
      g /= 255
      b /= 255
      let cmin = Math.min(r,g,b),
          cmax = Math.max(r,g,b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0

      if (delta == 0) h = 0;
      else if (cmax == r) h = ((g - b) / delta) % 6
      else if (cmax == g) h = (b - r) / delta + 2
      else h = (r - g) / delta + 4

      h = Math.round(h * 60)

      if (h < 0) h += 360

      l = (cmax + cmin) / 2
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
      s = +(s * 100).toFixed(1)
      l = +(l * 100).toFixed(1)

      return {
        hue: h,
        saturation: s,
        lightness: l
      }
    }
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
  background-color: var(--clr-secondary-800-3);
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
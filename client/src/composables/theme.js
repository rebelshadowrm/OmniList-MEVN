import {reactive, readonly, computed} from 'vue'

//if we'd want to save theme in global state
const state = reactive({
    colors: {
        primaryColor: '',
        secondaryColor: '',
        accentColor: ''
    }
})

const getters = {
    getTheme: () => {
        return computed( () => state.colors)
    },
    getLocalColors: () => {
        return JSON.parse(localStorage.getItem("color"))
    },
    getFetchedTheme: () => {
        //TODO: fetch user's theme
    }
}

const setters = {
    setTheme: (clr) => {
        const color = getters.getLocalColors()
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
    setPrimaryColor: (color) => {
        document.documentElement.style.setProperty('--clr-primary-h', `${color.hue}deg`)
        document.documentElement.style.setProperty('--clr-primary-s', `${color.saturation}%`)
    },
    setSecondaryColor: (color) => {
        document.documentElement.style.setProperty('--clr-secondary-h', `${color.hue}deg`)
        document.documentElement.style.setProperty('--clr-secondary-s', `${color.saturation}%`)
    },
    setAccentColor: (color) => {
        document.documentElement.style.setProperty('--clr-accent-h', `${color.hue}deg`)
        document.documentElement.style.setProperty('--clr-accent-s', `${color.saturation}%`)
    },

}

const methods = {
        HexToHSL: (H) => {
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
        },
}

export default () => {
    return {
        state: readonly(state),
        ...getters,
        ...setters,
        ...methods,
    };
}

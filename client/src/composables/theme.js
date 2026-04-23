import {reactive, readonly, computed} from 'vue'

const DEFAULT_THEME = {
    mode: 'basic',
    paletteMode: 'original',
    primaryColor: '#e85e30',
    secondaryColor: '',
    accentColor: ''
}

const DEFAULT_CHROMA = .13
const MAX_CHROMA = .24

const PALETTE_MODES = {
    original: {secondary: 90, accent: 270},
    true: {secondary: 180, accent: 30},
    split: {secondary: 150, accent: 210},
    triadic: {secondary: 120, accent: 240},
}

const themeVariables = {
    palette: ['--clr-secondary-offset', '--clr-accent-offset'],
    primaryColor: ['--clr-primary-h', '--clr-primary-s', '--clr-primary-c'],
    secondaryColor: ['--clr-secondary-h', '--clr-secondary-s', '--clr-secondary-c'],
    accentColor: ['--clr-accent-h', '--clr-accent-s', '--clr-accent-c']
}

//if we'd want to save theme in global state
const state = reactive({
    colors: {...DEFAULT_THEME}
})

function clearThemeVariables() {
    Object.values(themeVariables)
        .flat()
        .forEach(variable => document.documentElement.style.removeProperty(variable))
}

function normalizeTheme(colors = {}, fallback = {}) {
    return {
        mode: colors?.mode ?? fallback?.mode ?? DEFAULT_THEME.mode,
        paletteMode: colors?.paletteMode ?? fallback?.paletteMode ?? DEFAULT_THEME.paletteMode,
        primaryColor: colors?.primaryColor ?? fallback?.primaryColor ?? DEFAULT_THEME.primaryColor,
        secondaryColor: colors?.secondaryColor ?? fallback?.secondaryColor ?? DEFAULT_THEME.secondaryColor,
        accentColor: colors?.accentColor ?? fallback?.accentColor ?? DEFAULT_THEME.accentColor
    }
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function normalizeHue(value) {
    const hue = Number(value)
    if (!Number.isFinite(hue)) return 0
    return Math.round(((hue % 360) + 360) % 360)
}

function normalizeChroma(value) {
    const chroma = Number(value)
    if (!Number.isFinite(chroma)) return DEFAULT_CHROMA
    return +clamp(chroma, 0, MAX_CHROMA).toFixed(3)
}

function normalizeSaturation(value, chroma) {
    if (value === null || value === undefined) return +clamp(chroma * 520, 0, 100).toFixed(1)
    const saturation = Number(value)
    if (Number.isFinite(saturation)) return +clamp(saturation, 0, 100).toFixed(1)
    return +clamp(chroma * 520, 0, 100).toFixed(1)
}

function setColorVariables(name, color) {
    const hue = normalizeHue(color?.hue)
    const chroma = normalizeChroma(color?.chroma ?? color?.saturation / 520)
    const saturation = normalizeSaturation(color?.saturation, chroma)

    document.documentElement.style.setProperty(`--clr-${name}-h`, `${hue}deg`)
    document.documentElement.style.setProperty(`--clr-${name}-c`, chroma)
    document.documentElement.style.setProperty(`--clr-${name}-s`, `${saturation}%`)
}

function setPaletteVariables(mode) {
    const palette = PALETTE_MODES[mode] ?? PALETTE_MODES[DEFAULT_THEME.paletteMode]

    document.documentElement.style.setProperty('--clr-secondary-offset', `${palette.secondary}deg`)
    document.documentElement.style.setProperty('--clr-accent-offset', `${palette.accent}deg`)
}

function parseHex(hex) {
    if (typeof hex !== 'string') return null
    const value = hex.trim()

    if (/^#[0-9a-f]{3}$/i.test(value)) {
        return {
            r: parseInt(`${value[1]}${value[1]}`, 16),
            g: parseInt(`${value[2]}${value[2]}`, 16),
            b: parseInt(`${value[3]}${value[3]}`, 16)
        }
    }

    if (/^#[0-9a-f]{6}$/i.test(value)) {
        return {
            r: parseInt(value.slice(1, 3), 16),
            g: parseInt(value.slice(3, 5), 16),
            b: parseInt(value.slice(5, 7), 16)
        }
    }

    return null
}

function srgbToLinear(value) {
    const channel = value / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
}

function linearToSrgb(value) {
    const channel = value <= .0031308 ? value * 12.92 : 1.055 * (value ** (1 / 2.4)) - .055
    return Math.round(clamp(channel, 0, 1) * 255)
}

function componentToHex(value) {
    const hex = value.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}

const getters = {
    getTheme: () => {
        return computed( () => state.colors)
    },
    getLocalColors: () => {
        try {
            return JSON.parse(localStorage.getItem("color"))
        } catch (e) {
            return null
        }
    },
}

const setters = {
     setTheme: (clr) => {
        const color = normalizeTheme(clr, getters.getLocalColors())
        state.colors = color
        localStorage.setItem('color', JSON.stringify(color))
    },
    setPrimaryColor: (color) => setColorVariables('primary', color),
    setSecondaryColor: (color) => setColorVariables('secondary', color),
    setAccentColor: (color) => setColorVariables('accent', color),
    setAutoPalette: (mode) => setPaletteVariables(mode),

}

const methods = {
        clearThemes: () => {
            clearThemeVariables()
            state.colors = {...DEFAULT_THEME}
            localStorage.removeItem('color')
        },
        applyTheme: (colors, fallback = {}) => {
            const theme = normalizeTheme(colors, fallback)
            clearThemeVariables()

            state.colors = theme

            setters.setAutoPalette(theme.paletteMode)
            setters.setPrimaryColor(methods.HexToOKLCH(theme.primaryColor))

            if (theme.secondaryColor) {
                setters.setSecondaryColor(methods.HexToOKLCH(theme.secondaryColor))
            }

            if (theme.accentColor) {
                setters.setAccentColor(methods.HexToOKLCH(theme.accentColor))
            }

            return theme
        },
        HexToOKLCH: (hex) => {
            const rgb = parseHex(hex) ?? parseHex(DEFAULT_THEME.primaryColor)
            const r = srgbToLinear(rgb.r)
            const g = srgbToLinear(rgb.g)
            const b = srgbToLinear(rgb.b)

            const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b)
            const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b)
            const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b)

            const lightness = .2104542553 * l + .793617785 * m - .0040720468 * s
            const a = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s
            const blueYellow = .0259040371 * l + .7827717662 * m - .808675766 * s
            const chroma = Math.sqrt(a * a + blueYellow * blueYellow)
            let hue = Math.atan2(blueYellow, a) * 180 / Math.PI

            if (hue < 0) hue += 360

            return {
                hue: normalizeHue(hue),
                chroma: normalizeChroma(chroma),
                saturation: normalizeSaturation(null, chroma),
                lightness: +(lightness * 100).toFixed(1)
            }
        },
        OKLCHToHex: (lightness, chroma, hue) => {
            const l = clamp(Number(lightness) / 100, 0, 1)
            const c = normalizeChroma(chroma)
            const h = normalizeHue(hue) * Math.PI / 180
            const a = c * Math.cos(h)
            const b = c * Math.sin(h)

            const lPrime = l + .3963377774 * a + .2158037573 * b
            const mPrime = l - .1055613458 * a - .0638541728 * b
            const sPrime = l - .0894841775 * a - 1.291485548 * b

            const lCubed = lPrime ** 3
            const mCubed = mPrime ** 3
            const sCubed = sPrime ** 3

            const r = 4.0767416621 * lCubed - 3.3077115913 * mCubed + .2309699292 * sCubed
            const g = -1.2684380046 * lCubed + 2.6097574011 * mCubed - .3413193965 * sCubed
            const blue = -.0041960863 * lCubed - .7034186147 * mCubed + 1.707614701 * sCubed

            return `#${componentToHex(linearToSrgb(r))}${componentToHex(linearToSrgb(g))}${componentToHex(linearToSrgb(blue))}`
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

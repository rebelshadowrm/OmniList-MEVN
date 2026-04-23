export const HOME_PREFERENCES_KEY = 'omnilist.homePreferences'
export const HOME_BANNER_DISMISSED_KEY = 'omnilist.homePreferencesBannerDismissed'

export const HOME_MEDIA_OPTIONS = [
  {
    key: 'anime',
    mediaType: 'ANIME',
    label: 'Anime',
    benefit: 'seasonal tracking, favorites, and watch progress',
  },
  {
    key: 'manga',
    mediaType: 'MANGA',
    label: 'Manga',
    benefit: 'reading progress, favorites, and discovery',
  },
  {
    key: 'movies',
    mediaType: 'MOVIE',
    label: 'Movies',
    benefit: 'movie discovery and release browsing',
  },
  {
    key: 'tv',
    mediaType: 'TV',
    label: 'TV',
    benefit: 'TV discovery and first-air filtering',
  },
]

export const HOME_INTEREST_LEVELS = [
  {value: 'very', label: 'Very'},
  {value: 'somewhat', label: 'Somewhat'},
  {value: 'not', label: 'Not'},
]

export const HOME_STYLE_PRESETS = [
  {
    value: 'balanced',
    label: 'Style 1',
    name: 'Balanced',
    description: 'A general home mix with discovery, community, and news close together.',
  },
  {
    value: 'media-first',
    label: 'Style 2',
    name: 'Media first',
    description: 'Prioritizes trending media rows before community modules.',
  },
  {
    value: 'compact',
    label: 'Style 3',
    name: 'Compact',
    description: 'Keeps the dashboard denser with fewer rows per section.',
  },
]

export const THEME_PRESETS = [
  {
    name: 'Regal',
    colors: {
      mode: 'basic',
      paletteMode: 'original',
      primaryColor: '#30ccf0',
      secondaryColor: '',
      accentColor: '',
    },
  },
  {
    name: 'Necrotic',
    colors: {
      mode: 'basic',
      paletteMode: 'true',
      primaryColor: '#a1ccb8',
      secondaryColor: '',
      accentColor: '',
    },
  },
  {
    name: 'Lumen',
    colors: {
      mode: 'basic',
      paletteMode: 'triadic',
      primaryColor: '#d6a82f',
      secondaryColor: '',
      accentColor: '',
    },
  },
]

const DEFAULT_INTERESTS = HOME_MEDIA_OPTIONS.reduce((interests, option) => ({
  ...interests,
  [option.key]: option.key === 'anime' ? 'very' : 'somewhat',
}), {})

export function defaultHomePreferences() {
  return {
    style: HOME_STYLE_PRESETS[0].value,
    interests: {...DEFAULT_INTERESTS},
  }
}

export function normalizeHomePreferences(preferences = {}) {
  const defaults = defaultHomePreferences()
  const validStyles = HOME_STYLE_PRESETS.map(style => style.value)
  const validInterestLevels = HOME_INTEREST_LEVELS.map(level => level.value)
  const interests = {}

  HOME_MEDIA_OPTIONS.forEach(option => {
    const interest = preferences?.interests?.[option.key]
    interests[option.key] = validInterestLevels.includes(interest) ? interest : defaults.interests[option.key]
  })

  return {
    ...preferences,
    style: validStyles.includes(preferences?.style) ? preferences.style : defaults.style,
    interests,
  }
}

export function homePreferencesFromUser(user) {
  return user?.userPreferences?.dashboardLayout?.home
    ? normalizeHomePreferences(user.userPreferences.dashboardLayout.home)
    : null
}

export function readLocalHomePreferences() {
  try {
    const preferences = JSON.parse(localStorage.getItem(HOME_PREFERENCES_KEY))
    return preferences ? normalizeHomePreferences(preferences) : null
  } catch (e) {
    return null
  }
}

export function saveLocalHomePreferences(preferences) {
  const normalized = normalizeHomePreferences({
    ...preferences,
    updatedAt: new Date().toISOString(),
  })

  localStorage.setItem(HOME_PREFERENCES_KEY, JSON.stringify(normalized))
  return normalized
}

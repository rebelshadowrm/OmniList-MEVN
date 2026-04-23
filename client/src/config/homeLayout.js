import {HOME_MEDIA_OPTIONS} from "./homePreferences"

export const HOME_GRID_COLUMNS = 3
export const HOME_GRID_ROWS = 6
export const HOME_MODULE_MAX_COLS = 2
export const HOME_MODULE_MAX_ROWS = 3

export const ALLOWED_HOME_MODULE_SIZES = [
  {cols: 1, rows: 1},
  {cols: 1, rows: 2},
  {cols: 1, rows: 3},
  {cols: 2, rows: 1},
  {cols: 2, rows: 2},
  {cols: 2, rows: 3},
]

const MODULE_SLOT_PRESETS = {
  balanced: {
    columns: 3,
    rows: 6,
    modules: [
      {type: 'media-slot', slot: 0, col: 1, row: 1, colSpan: 2, rowSpan: 2},
      {type: 'community', id: 'community', col: 3, row: 1, colSpan: 1, rowSpan: 2},
      {type: 'news', id: 'news', col: 3, row: 3, colSpan: 1, rowSpan: 3},
      {type: 'media-slot', slot: 1, col: 1, row: 3, colSpan: 2, rowSpan: 1},
      {type: 'media-slot', slot: 2, col: 1, row: 4, colSpan: 2, rowSpan: 1},
      {type: 'media-slot', slot: 3, col: 1, row: 5, colSpan: 2, rowSpan: 1},
    ],
  },
  'media-first': {
    rows: HOME_GRID_ROWS,
    modules: [
      {type: 'media-slot', slot: 0, col: 1, row: 1, colSpan: 2, rowSpan: 3},
      {type: 'media-slot', slot: 1, col: 3, row: 1, colSpan: 1, rowSpan: 2},
      {type: 'community', id: 'community', col: 3, row: 3, colSpan: 1, rowSpan: 1},
      {type: 'news', id: 'news', col: 1, row: 4, colSpan: 2, rowSpan: 1},
      {type: 'media-slot', slot: 2, col: 1, row: 5, colSpan: 1, rowSpan: 2},
      {type: 'media-slot', slot: 3, col: 2, row: 5, colSpan: 1, rowSpan: 2},
    ],
  },
  compact: {
    rows: 5,
    modules: [
      {type: 'media-slot', slot: 0, col: 1, row: 1, colSpan: 2, rowSpan: 2},
      {type: 'news', id: 'news', col: 3, row: 1, colSpan: 1, rowSpan: 2},
      {type: 'media-slot', slot: 1, col: 1, row: 3, colSpan: 1, rowSpan: 2},
      {type: 'media-slot', slot: 2, col: 2, row: 3, colSpan: 1, rowSpan: 2},
      {type: 'community', id: 'community', col: 3, row: 3, colSpan: 1, rowSpan: 1},
      {type: 'media-slot', slot: 3, col: 3, row: 4, colSpan: 1, rowSpan: 1},
    ],
  },
}

const GUEST_MODULES = [
  {type: 'news', id: 'news', col: 1, row: 1, colSpan: 1, rowSpan: 3},
  {type: 'media-slot', slot: 0, col: 2, row: 1, colSpan: 2, rowSpan: 3},
  {type: 'media-slot', slot: 1, col: 1, row: 4, colSpan: 1, rowSpan: 2},
  {type: 'media-slot', slot: 2, col: 2, row: 4, colSpan: 1, rowSpan: 2},
  {type: 'media-slot', slot: 3, col: 3, row: 4, colSpan: 1, rowSpan: 2},
]

function moduleCells(module) {
  const cells = []

  for (let row = module.row; row < module.row + module.rowSpan; row += 1) {
    for (let col = module.col; col < module.col + module.colSpan; col += 1) {
      cells.push(`${col}:${row}`)
    }
  }

  return cells
}

function isAllowedSize(module) {
  return ALLOWED_HOME_MODULE_SIZES.some(size => (
    size.cols === module.colSpan && size.rows === module.rowSpan
  ))
}

export function isValidHomeModule(module, maxRows = HOME_GRID_ROWS, maxColumns = HOME_GRID_COLUMNS) {
  return Number.isInteger(module.col)
      && Number.isInteger(module.row)
      && Number.isInteger(module.colSpan)
      && Number.isInteger(module.rowSpan)
      && module.col >= 1
      && module.row >= 1
      && module.colSpan >= 1
      && module.rowSpan >= 1
      && module.colSpan <= HOME_MODULE_MAX_COLS
      && module.rowSpan <= HOME_MODULE_MAX_ROWS
      && isAllowedSize(module)
      && module.col + module.colSpan - 1 <= maxColumns
      && module.row + module.rowSpan - 1 <= maxRows
}

export function normalizeHomeModules(modules = [], maxRows = HOME_GRID_ROWS, maxColumns = HOME_GRID_COLUMNS) {
  const usedCells = new Set()

  return modules.filter(module => {
    if (!isValidHomeModule(module, maxRows, maxColumns)) {
      return false
    }

    const cells = moduleCells(module)
    if (cells.some(cell => usedCells.has(cell))) {
      return false
    }

    cells.forEach(cell => usedCells.add(cell))
    return true
  })
}

function interestWeight(interest) {
  return {
    very: 2,
    somewhat: 1,
    not: 0,
  }[interest] ?? 1
}

export function preferredMediaOptions(preferences) {
  return HOME_MEDIA_OPTIONS
    .map(option => ({
      ...option,
      interest: preferences?.interests?.[option.key] ?? 'somewhat',
    }))
    .filter(option => option.interest !== 'not')
    .sort((a, b) => interestWeight(b.interest) - interestWeight(a.interest))
}

export function buildHomeModules({preferences, isLoggedIn}) {
  const style = preferences?.style ?? 'balanced'
  const preset = isLoggedIn
    ? MODULE_SLOT_PRESETS[style] ?? MODULE_SLOT_PRESETS.balanced
    : {rows: HOME_GRID_ROWS, modules: GUEST_MODULES}
  const columns = preset.columns ?? HOME_GRID_COLUMNS
  const mediaOptions = preferredMediaOptions(preferences)
  const modules = preset.modules
    .map(module => {
      if (module.type !== 'media-slot') {
        return {
          ...module,
          enabled: module.type !== 'community' || isLoggedIn,
        }
      }

      const media = mediaOptions[module.slot]
      if (!media) {
        return null
      }

      return {
        ...module,
        type: 'media',
        id: `media-${media.key}`,
        mediaType: media.mediaType,
        title: `${media.label} Discovery`,
        eyebrow: media.interest === 'very' ? 'Priority' : 'Trending',
      }
    })
    .filter(module => module?.enabled !== false)

  return {
    columns,
    rows: preset.rows,
    modules: normalizeHomeModules(modules, preset.rows, columns),
  }
}

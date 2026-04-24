import {HOME_MEDIA_OPTIONS} from "./homePreferences"

export const HOME_GRID_COLUMNS = 3
export const HOME_GRID_ROWS = 5
export const HOME_GUEST_GRID_ROWS = 4
export const HOME_MODULE_MAX_COLS = 3
export const HOME_MODULE_MAX_ROWS = 2

export const ALLOWED_HOME_MODULE_SIZES = [
  {cols: 1, rows: 1},
  {cols: 2, rows: 1},
  {cols: 3, rows: 1},
  {cols: 1, rows: 2},
  {cols: 2, rows: 2},
  {cols: 3, rows: 2},
]

const MEDIA_LAYOUT_ORDER = ['anime', 'movies', 'tv', 'manga']
function interestWeight(interest) {
  return {
    very: 2,
    somewhat: 1,
    not: 0,
  }[interest] ?? 1
}

function mediaTieBreaker(option) {
  const index = MEDIA_LAYOUT_ORDER.indexOf(option.key)

  return index === -1 ? MEDIA_LAYOUT_ORDER.length : index
}

export function preferredMediaOptions(preferences) {
  return HOME_MEDIA_OPTIONS
    .map(option => ({
      ...option,
      interest: preferences?.interests?.[option.key] ?? 'somewhat',
    }))
    .filter(option => option.interest !== 'not')
    .sort((a, b) => {
      const weight = interestWeight(b.interest) - interestWeight(a.interest)

      return weight || mediaTieBreaker(a) - mediaTieBreaker(b)
    })
}

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

function areaName(id) {
  return `${id}`.replace(/[^a-z0-9]/gi, '_')
}

function mediaModule(media, index) {
  return {
    type: 'media',
    id: `media-${media.key}`,
    area: areaName(`media-${media.key}`),
    mediaType: media.mediaType,
    title: `${media.label} Discovery`,
    eyebrow: media.interest === 'very' ? 'Priority' : 'Trending',
    interest: media.interest,
    order: index,
    areaSize: 1,
  }
}

function auxiliaryModules(isLoggedIn) {
  const modules = [
    {
      type: 'news',
      id: 'news',
      area: 'news',
      order: 0,
      areaSize: 1,
    },
  ]

  if (!isLoggedIn) return modules

  return [
    {
      type: 'community-discussions',
      id: 'community-discussions',
      area: 'community_discussions',
      title: 'Recent Discussions',
      threadType: 'discussions',
      order: 0,
      areaSize: 1,
    },
    ...modules,
    {
      type: 'community-reviews',
      id: 'community-reviews',
      area: 'community_reviews',
      title: 'Recent Reviews',
      threadType: 'reviews',
      order: 1,
      areaSize: 1,
    },
  ]
}

function visualPriority(module) {
  if (module.type === 'media' && module.interest === 'very') return 100 - module.order
  if (module.type === 'media') return 80 - module.order
  if (module.type === 'community-discussions') return 79.5
  if (module.type === 'news') return 78.5
  if (module.type === 'community-reviews') return 60

  return 0
}

function growthPriority(module, style, firstMediaId) {
  if (style === 'media-first' && module.id === firstMediaId) return 140
  if (module.type === 'media' && module.interest === 'very') return 130 - module.order
  if (module.type === 'community-discussions') return 95
  if (module.type === 'news') return 90
  if (module.type === 'media') return 80 - module.order

  return 0
}

function maxArea(module, style, firstMediaId) {
  if (style === 'media-first' && module.id === firstMediaId) return 6
  if (module.type === 'media') return 4
  if (module.type === 'community-discussions' || module.type === 'news') return 2

  return 1
}

function targetCellCount(modules, isLoggedIn, style) {
  const baseRows = style === 'compact'
    ? 4
    : isLoggedIn ? HOME_GRID_ROWS : HOME_GUEST_GRID_ROWS
  const maxCells = modules.reduce((total, module) => {
    const firstMedia = modules.find(({type}) => type === 'media')

    return total + maxArea(module, style, firstMedia?.id)
  }, 0)

  return Math.min(baseRows * HOME_GRID_COLUMNS, maxCells)
}

function distributeArea(modules, targetCells, style) {
  const firstMediaId = modules.find(({type}) => type === 'media')?.id
  let remainingCells = targetCells - modules.length

  modules.forEach(module => {
    module.areaSize = 1
  })

  const priorityModules = modules
    .filter(module => (
      module.id === firstMediaId && style === 'media-first'
    ) || (
      module.type === 'media' && module.interest === 'very'
    ))
    .sort((a, b) => growthPriority(b, style, firstMediaId) - growthPriority(a, style, firstMediaId))

  for (const module of priorityModules) {
    while (remainingCells > 0 && module.areaSize < maxArea(module, style, firstMediaId)) {
      module.areaSize += 1
      remainingCells -= 1
    }
  }

  const growable = [...modules]
    .filter(module => !priorityModules.includes(module))
    .sort((a, b) => {
      const priority = growthPriority(b, style, firstMediaId) - growthPriority(a, style, firstMediaId)

      return priority || visualPriority(b) - visualPriority(a)
    })

  while (remainingCells > 0 && growable.some(module => module.areaSize < maxArea(module, style, firstMediaId))) {
    for (const module of growable) {
      if (remainingCells <= 0) break
      if (module.areaSize >= maxArea(module, style, firstMediaId)) continue

      module.areaSize += 1
      remainingCells -= 1
    }
  }

  return modules
}

function shapeOptions(module) {
  if (module.areaSize === 6) return [{cols: 3, rows: 2}]
  if (module.areaSize === 4) return [{cols: 2, rows: 2}]
  if (module.areaSize === 3) return [{cols: 3, rows: 1}]
  if (module.areaSize === 2) {
    if (module.type === 'community-discussions' || module.type === 'news') {
      return [
        {cols: 1, rows: 2},
        {cols: 2, rows: 1},
      ]
    }

    return [
      {cols: 2, rows: 1},
      {cols: 1, rows: 2},
    ]
  }

  return [{cols: 1, rows: 1}]
}

function createGrid(rows, columns) {
  return Array.from({length: rows}, () => Array.from({length: columns}, () => null))
}

function canPlace(grid, row, col, shape) {
  if (row + shape.rows > grid.length || col + shape.cols > grid[0].length) return false

  for (let y = row; y < row + shape.rows; y += 1) {
    for (let x = col; x < col + shape.cols; x += 1) {
      if (grid[y][x]) return false
    }
  }

  return true
}

function placeModule(grid, row, col, shape, module) {
  for (let y = row; y < row + shape.rows; y += 1) {
    for (let x = col; x < col + shape.cols; x += 1) {
      grid[y][x] = module.area
    }
  }

  return {
    ...module,
    col: col + 1,
    row: row + 1,
    colSpan: shape.cols,
    rowSpan: shape.rows,
  }
}

function packModules(modules, rows, columns) {
  const grid = createGrid(rows, columns)
  const packed = []
  const ordered = [...modules].sort((a, b) => {
    const priority = visualPriority(b) - visualPriority(a)

    return priority || b.areaSize - a.areaSize
  })

  for (const module of ordered) {
    let placed = null

    for (let row = 0; row < rows && !placed; row += 1) {
      for (let col = 0; col < columns && !placed; col += 1) {
        for (const shape of shapeOptions(module)) {
          if (canPlace(grid, row, col, shape)) {
            placed = placeModule(grid, row, col, shape, module)
            break
          }
        }
      }
    }

    if (!placed) return null

    packed.push(placed)
  }

  return {grid, modules: packed}
}

function buildAreaTemplate(grid) {
  return grid
    .map(row => `"${row.map(area => area ?? '.').join(' ')}"`)
    .join(' ')
}

export function buildHomeModules({preferences, isLoggedIn}) {
  const style = preferences?.style ?? 'balanced'
  const mediaModules = preferredMediaOptions(preferences).map(mediaModule)
  const modules = [
    ...mediaModules,
    ...auxiliaryModules(isLoggedIn),
  ]

  if (!modules.length) {
    return {
      columns: HOME_GRID_COLUMNS,
      rows: 0,
      areas: '',
      modules: [],
    }
  }

  const targetCells = targetCellCount(modules, isLoggedIn, style)
  const sizedModules = distributeArea(modules, targetCells, style)
  const startingRows = Math.max(1, Math.ceil(targetCells / HOME_GRID_COLUMNS))
  let layout = null
  let rows = startingRows

  while (!layout && rows <= HOME_GRID_ROWS + 1) {
    layout = packModules(sizedModules, rows, HOME_GRID_COLUMNS)
    if (!layout) rows += 1
  }

  const normalizedModules = normalizeHomeModules(
    layout?.modules ?? [],
    rows,
    HOME_GRID_COLUMNS
  )

  return {
    columns: HOME_GRID_COLUMNS,
    rows,
    areas: layout ? buildAreaTemplate(layout.grid) : '',
    modules: normalizedModules,
  }
}

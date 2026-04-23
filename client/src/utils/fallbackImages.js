const FALLBACKS = {
  poster: {
    width: 600,
    height: 900,
    title: 'No Image',
    bg: '#11161c',
    panel: '#1c2834',
    accent: '#2b9fb3',
  },
  avatar: {
    width: 300,
    height: 300,
    title: 'User',
    bg: '#141a20',
    panel: '#22303c',
    accent: '#c99b33',
  },
  banner: {
    width: 1600,
    height: 450,
    title: 'OmniList',
    bg: '#10161d',
    panel: '#1b2a36',
    accent: '#2b9fb3',
  },
}

function cleanLabel(label, fallback) {
  const value = Array.isArray(label) ? label.join(' ') : label
  const text = `${value ?? ''}`
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return text || fallback
}

function initials(label) {
  return cleanLabel(label, 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function escapeSvgText(value) {
  return `${value}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fallbackOptions(typeOrOptions, label) {
  if (typeof typeOrOptions === 'object' && typeOrOptions !== null) {
    const type = typeOrOptions.type ?? 'poster'

    return {
      ...FALLBACKS.poster,
      ...FALLBACKS[type],
      type,
      label: typeOrOptions.label,
    }
  }

  const type = typeOrOptions ?? 'poster'

  return {
    ...FALLBACKS.poster,
    ...FALLBACKS[type],
    type,
    label,
  }
}

function fallbackSvg(options) {
  const label = cleanLabel(options.label, options.title)
  const displayText = options.type === 'avatar'
    ? initials(label)
    : cleanLabel(label, options.title).slice(0, 34)
  const escapedText = escapeSvgText(displayText)
  const fontSize = options.type === 'banner' ? 64 : options.type === 'avatar' ? 86 : 54

  if (options.type === 'avatar') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}" role="img" aria-label="${escapedText}">
        <rect width="100%" height="100%" fill="${options.bg}"/>
        <circle cx="150" cy="126" r="76" fill="${options.panel}"/>
        <circle cx="150" cy="115" r="48" fill="${options.accent}" opacity=".9"/>
        <path d="M58 270c16-58 56-88 92-88s76 30 92 88" fill="${options.accent}" opacity=".75"/>
        <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${escapedText}</text>
      </svg>
    `
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}" role="img" aria-label="${escapedText}">
      <rect width="100%" height="100%" fill="${options.bg}"/>
      <rect x="${options.width * 0.08}" y="${options.height * 0.08}" width="${options.width * 0.84}" height="${options.height * 0.84}" rx="18" fill="${options.panel}" stroke="${options.accent}" stroke-width="8" opacity=".95"/>
      <path d="M0 ${options.height * 0.78} C ${options.width * 0.18} ${options.height * 0.62}, ${options.width * 0.35} ${options.height * 0.9}, ${options.width * 0.55} ${options.height * 0.72} S ${options.width * 0.86} ${options.height * 0.64}, ${options.width} ${options.height * 0.76} V ${options.height} H 0 Z" fill="${options.accent}" opacity=".32"/>
      <circle cx="${options.width * 0.78}" cy="${options.height * 0.22}" r="${Math.min(options.width, options.height) * 0.08}" fill="${options.accent}" opacity=".72"/>
      <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${escapedText}</text>
    </svg>
  `
}

export function fallbackImage(typeOrOptions = 'poster', label) {
  const options = fallbackOptions(typeOrOptions, label)

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg(options))}`
}

export function imageOrFallback(src, typeOrOptions = 'poster', label) {
  return typeof src === 'string' && src.trim().length > 0
    ? src
    : fallbackImage(typeOrOptions, label)
}

export function useFallbackImage(event, typeOrOptions = 'poster', label) {
  if (!event?.target) {
    return
  }

  event.target.onerror = null
  event.target.src = fallbackImage(typeOrOptions, label)
}

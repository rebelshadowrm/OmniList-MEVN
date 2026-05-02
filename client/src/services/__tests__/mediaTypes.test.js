import { describe, expect, it } from 'vitest'
import { mediaConfig, mediaSortOptions } from '../../config/mediaTypes.js'

describe('media type sort options', () => {
  it('uses Trending as the default book browse sort', () => {
    expect(mediaConfig('BOOK').defaultSort).toBe('trending')
  })

  it('does not show relevance for book browsing without search', () => {
    const sorts = mediaSortOptions('BOOK').map(sort => sort.value)

    expect(sorts[0]).toBe('trending')
    expect(sorts).not.toContain('relevance')
  })

  it('shows Best Match for book searching', () => {
    const sorts = mediaSortOptions('BOOK', { search: 'dune' })

    expect(sorts[0]).toEqual({ name: 'Best Match', value: 'relevance' })
    expect(sorts.map(sort => sort.value)).toContain('trending')
  })

  it('leaves non-book sorts unchanged', () => {
    const animeSorts = mediaSortOptions('ANIME', { search: 'frieren' }).map(sort => sort.value)

    expect(animeSorts).toContain('TRENDING_DESC')
    expect(animeSorts).toContain('SEARCH_MATCH')
  })
})

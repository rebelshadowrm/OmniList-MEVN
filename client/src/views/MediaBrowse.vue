<template>
  <div class="browse-options">
    <div class="search">
      <input v-model="search" type="text" name="search" id="search" placeholder="search" />
    </div>
    <div class="genres">
      <VueMultiselect
          v-if="supportsGenreFilters()"
          v-model="genre"
          :options="genres"
          :multiple="true"
          :searchable="true"
          :close-on-select="true"
          :allow-empty="true"
          placeholder="Filter by genre"
      />
    </div>
    <div v-if="supportsYearFilter()" class="year">
      <input v-model="filterYear" type="number" :placeholder="media.yearFilterLabel" min="1900" max="2100" />
    </div>
    <div class="sort-by">
      <VueMultiselect
          v-model="sortBy"
          :options="sortTypes"
          :multiple="false"
          :searchable="false"
          :close-on-select="true"
          :allow-empty="false"
          label="name"
          track-by="name"
          :custom-label="customLabel"
          :show-labels="false"
      />
    </div>
    <button @click="update">update</button>
    <div v-if="hasActiveGenreFilters()" class="active-filters">
      <button v-for="genre in activeGenres() ?? []"
              :key="`include-${genre}`"
              :class="['filter-chip', genreClass(genre), 'included']"
              type="button"
              @click="handleGenreClick(genre)"
              @dblclick="handleGenreDoubleClick(genre)">{{genre}}</button>
      <button v-for="genre in activeExcludedGenres() ?? []"
              :key="`exclude-${genre}`"
              :class="['filter-chip', genreClass(genre), 'excluded']"
              type="button"
              @click="handleGenreClick(genre)"
              @dblclick="handleGenreDoubleClick(genre)">{{genre}}</button>
    </div>
    <span class="refresh-indicator" :class="{active: isRefreshing}" aria-hidden="true"></span>
  </div>
  <div v-if="loading" class="loading">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="errorMessage" class="browse-message error-message">
    <h1>{{errorMessage}}</h1>
  </div>
  <div v-else-if="data.length === 0" class="browse-message">
    <h1>No results found.</h1>
  </div>
  <div v-else class="browse-items">
    <BrowseItem v-for="item in data" :key="item.id"
                :description="item.description"
                :id="item.id"
                :img="item.coverImage.large"
                :score="item.averageScore"
                :title="item.title?.english ?? item.title?.romaji"
                :progress-value="mediaProgressValue(item)"
                :progress-label="media.progressLabel"
                :media-path="media.path"
                :genres="item.genres"
                :selected-genres="activeGenres() ?? []"
                :excluded-genres="activeExcludedGenres() ?? []"
                @genre-clicked="cycleGenre"
                @genre-isolated="isolateGenre"
    />
  </div>
</template>

<script>
import BrowseItem from "../components/BrowseItem.vue"
import VueMultiselect from 'vue-multiselect'
import {mediaConfig} from "../config/mediaTypes.js"
export default {
  name: "MediaBrowse",
  components: {
    BrowseItem,
    VueMultiselect
  },
  props: {
    mediaType: {
      type: String,
      default: 'ANIME',
    },
  },
  data() {
    return {
      data: [],
      genres: [],
      search: undefined,
      filterYear: undefined,
      genre: undefined,
      excludedGenre: undefined,
      sortBy: null,
      loading: true,
      errorMessage: '',
      isRefreshing: false,
      refreshId: 0,
      fetchRequestId: 0,
      genreClickTimer: null,
      skipNextRouteFetch: false,
      resultCache: new Map(),
    }
  },
  async created() {
    this.loading = true
    await this.loadGenreOptions()
    this.hydrateFiltersFromRoute()
    await this.fetchData()
  },
  computed: {
    media() {
      return mediaConfig(this.mediaType)
    },
    sortTypes() {
      return this.media.sortOptions ?? []
    },
  },
  watch: {
    async mediaType() {
      this.data = []
      this.errorMessage = ''
      this.loading = true
      await this.loadGenreOptions()
      this.hydrateFiltersFromRoute()
      await this.fetchData({useCache: false})
    },
    async '$route.query'() {
      if (this.skipNextRouteFetch) {
        this.skipNextRouteFetch = false
        return
      }

      this.hydrateFiltersFromRoute()
      await this.fetchData({quiet: !this.loading})
    },
  },
  methods: {
    defaultSortValue() {
      return this.media.defaultSort ?? this.sortTypes[0]?.value
    },
    supportsGenreFilters() {
      return this.genres.length > 0
    },
    supportsYearFilter() {
      return !!this.media.yearFilterLabel
    },
    async loadGenreOptions() {
      if (this.media.source !== 'TMDB') {
        this.genres = [...(this.media.genreOptions ?? [])]
        return
      }

      try {
        const res = await fetch(`/api/tmdb/${this.media.path}/genres`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message ?? res.statusText)
        }

        this.genres = data.map(genre => genre.name)
      } catch (err) {
        console.log(err.message)
        this.genres = []
      }
    },
    queryValue(value) {
      return Array.isArray(value) ? value[0] : value
    },
    queryGenres(value) {
      if (!this.supportsGenreFilters()) {
        return []
      }

      const values = Array.isArray(value) ? value : value ? [value] : []

      return values
          .flatMap(item => `${item}`.split(','))
          .map(item => item.trim())
          .filter(item => this.genres.includes(item))
    },
    querySort(value) {
      const sort = this.queryValue(value)

      return this.sortTypes.find(type => type.value === sort) ?? this.sortTypes[0]
    },
    queryYear(value) {
      if (!this.supportsYearFilter()) {
        return null
      }

      const year = Number(this.queryValue(value))

      return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null
    },
    genreClass(genre) {
      return `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    },
    normalizedQuery(query = this.$route.query) {
      const search = (this.queryValue(query.search) ?? this.queryValue(query.q))?.trim() || null
      const genres = this.queryGenres(query.genre)
      const excludedGenres = this.queryGenres(query.exclude)
      const sort = this.querySort(query.sort).value
      const year = this.queryYear(query.year)

      return {
        search,
        genres: genres.length ? [...genres].sort() : null,
        excludedGenres: excludedGenres.length ? [...excludedGenres].sort() : null,
        sort,
        year,
      }
    },
    hydrateFiltersFromRoute() {
      const query = this.normalizedQuery()

      this.search = query.search ?? undefined
      this.filterYear = query.year ?? undefined
      this.genre = query.genres ? [...query.genres] : undefined
      this.excludedGenre = query.excludedGenres ? [...query.excludedGenres] : undefined
      this.sortBy = this.querySort(query.sort)
    },
    queryFromFilters() {
      const query = {}
      const search = this.activeSearch()
      const year = this.activeYear()
      const genres = this.activeGenres()
      const excludedGenres = this.activeExcludedGenres()
      const sort = this.activeSort()

      if (search) {
        query.search = search
      }

      if (genres && this.supportsGenreFilters()) {
        query.genre = genres
      }

      if (excludedGenres && this.supportsGenreFilters()) {
        query.exclude = excludedGenres
      }

      if (year && this.supportsYearFilter()) {
        query.year = year
      }

      if (sort !== this.defaultSortValue()) {
        query.sort = sort
      }

      return query
    },
    queriesMatch(queryA, queryB) {
      return JSON.stringify(this.normalizedQuery(queryA)) === JSON.stringify(this.normalizedQuery(queryB))
    },
    async syncRoute({replace = false} = {}) {
      const query = this.queryFromFilters()

      if (this.queriesMatch(this.$route.query, query)) {
        return false
      }

      this.skipNextRouteFetch = true

      try {
        await this.$router[replace ? 'replace' : 'push']({
          name: this.media.browseRoute,
          query,
        })
        return true
      } catch (err) {
        this.skipNextRouteFetch = false
        throw err
      }
    },
    activeSearch() {
      return this.search?.trim()?.length > 0 ? this.search.trim() : null
    },
    activeYear() {
      return this.queryYear(this.filterYear)
    },
    activeGenres() {
      return this.genre?.length > 0 ? this.genre : null
    },
    activeExcludedGenres() {
      return this.excludedGenre?.length > 0 ? this.excludedGenre : null
    },
    hasActiveGenreFilters() {
      return !!(this.activeGenres() || this.activeExcludedGenres())
    },
    addGenre(list, genre) {
      return [...new Set([...(list ?? []), genre])]
    },
    removeGenre(list, genre) {
      const updated = (list ?? []).filter(item => item !== genre)

      return updated.length ? updated : undefined
    },
    activeSort() {
      return this?.sortBy?.value ?? this.defaultSortValue()
    },
    cacheKey({
      search = this.activeSearch(),
      genres = this.activeGenres(),
      excludedGenres = this.activeExcludedGenres(),
      sort = this.activeSort(),
      year = this.activeYear(),
    } = {}) {
      return JSON.stringify({
        search,
        genres: genres ? [...genres].sort() : null,
        excludedGenres: excludedGenres ? [...excludedGenres].sort() : null,
        sort,
        year,
        mediaType: this.media.type,
      })
    },
    cacheResults(key, media) {
      this.resultCache.set(key, media)
    },
    mergeResults(priorityResults, fetchedResults) {
      const seen = new Set(priorityResults.map(item => item.id))

      return [
        ...priorityResults,
        ...fetchedResults.filter(item => !seen.has(item.id)),
      ]
    },
    localFilterMatches() {
      const sort = this.activeSort()
      const year = this.activeYear()
      const sourceKeys = [
        this.cacheKey({search: this.activeSearch(), genres: null, excludedGenres: null, sort, year}),
        this.cacheKey({search: null, genres: null, excludedGenres: null, sort, year}),
      ]
      const sourceResults = [
        ...this.data,
        ...sourceKeys.flatMap(key => this.resultCache.get(key) ?? []),
      ]
      const seen = new Set()
      const includedGenres = this.activeGenres() ?? []
      const excludedGenres = this.activeExcludedGenres() ?? []

      return sourceResults.filter(item => {
        if (seen.has(item.id)) {
          return false
        }

        if (includedGenres.length && !includedGenres.every(genre => item.genres?.includes(genre))) {
          return false
        }

        if (excludedGenres.some(genre => item.genres?.includes(genre))) {
          return false
        }

        seen.add(item.id)
        return true
      })
    },
    mediaProgressValue(item) {
      return item?.progressDisplay ?? this.aniListProgressDisplay(item) ?? item?.[this.media.totalField]
    },
    formatAiringDate(airingAt) {
      if (!airingAt) {
        return null
      }

      return new Date(airingAt * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    aniListProgressDisplay(item) {
      if (this.media.type !== 'ANIME' || !item?.nextAiringEpisode?.episode) {
        return null
      }

      const episode = item.nextAiringEpisode.episode
      const total = item.episodes && item.episodes >= episode ? `/${item.episodes}` : ''
      const airDate = this.formatAiringDate(item.nextAiringEpisode.airingAt)
      const airDateLabel = airDate ? ` airing ${airDate}` : ''

      return `${episode}${total}${airDateLabel}`
    },
    async requestMedia({
      search = this.activeSearch(),
      genres = this.activeGenres(),
      excludedGenres = this.activeExcludedGenres(),
      sort = this.activeSort(),
      year = this.activeYear(),
    } = {}) {
      this.errorMessage = ''

      if (this.media.source === 'TMDB') {
        return this.requestTmdbMedia({search, genres, excludedGenres, sort, year})
      }

      try {
        const url = 'https://graphql.anilist.co'
        const query = `
            query ($type: MediaType, $search: String, $genre: [String], $genreNot: [String], $sort: [MediaSort]) {
              Page {
                media(type: $type, search: $search, genre_in: $genre, genre_not_in: $genreNot, sort: $sort) {
                    id
                    title {
                      english
                      romaji
                    }
                    coverImage {
                      large
                    }
                    description
                    genres
                    episodes
                    chapters
                    volumes
                    status
                    nextAiringEpisode {
                      episode
                      airingAt
                    }
                    averageScore
                }
              }
            }
        `
        const variables = {
          type: this.media.type,
          search,
          genre: genres,
          genreNot: excludedGenres,
          sort: [sort],
        }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables
          })
        }
        const res = await fetch(url, options)
        const json = await res.json()

        if (!res.ok || json.errors?.length) {
          throw new Error(json.errors?.map(error => error.message).join(', ') ?? res.statusText)
        }

        return json.data?.Page?.media ?? []
      } catch(err) {
        console.log(err.message)
        this.errorMessage = err.message
        return []
      }
    },
    async requestTmdbMedia({
      search = this.activeSearch(),
      genres = this.activeGenres(),
      excludedGenres = this.activeExcludedGenres(),
      sort = this.activeSort(),
      year = this.activeYear(),
    } = {}) {
      try {
        const params = new URLSearchParams()

        if (search) {
          params.set('search', search)
        }

        if (genres?.length) {
          params.set('genre', genres.join(','))
        }

        if (excludedGenres?.length) {
          params.set('exclude', excludedGenres.join(','))
        }

        if (sort) {
          params.set('sort', sort)
        }

        if (year) {
          params.set('year', year)
        }

        const res = await fetch(`/api/tmdb/${this.media.path}/search?${params.toString()}`)
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.message ?? res.statusText)
        }

        return json
      } catch(err) {
        console.log(err.message)
        this.errorMessage = err.message
        return []
      }
    },
    async fetchData({useCache = true, quiet = false} = {}) {
      const fetchRequestId = this.fetchRequestId + 1
      this.fetchRequestId = fetchRequestId
      const key = this.cacheKey()
      const cachedResults = this.resultCache.get(key)

      if (useCache && cachedResults) {
        this.errorMessage = ''
        this.data = cachedResults

        if (quiet) {
          this.refreshResults(key)
        }

        return cachedResults
      }

      if (quiet) {
        this.refreshId += 1
        this.isRefreshing = true
      } else {
        this.loading = true
      }

      try {
        const media = await this.requestMedia()
        if (fetchRequestId !== this.fetchRequestId) {
          return media
        }

        this.cacheResults(key, media)
        this.data = media
        return media
      } finally {
        if (fetchRequestId === this.fetchRequestId) {
          this.loading = false
          this.isRefreshing = false
        }
      }
    },
    async refreshResults(key = this.cacheKey(), priorityResults = []) {
      const refreshId = this.refreshId + 1
      const mediaType = this.media.type
      this.refreshId = refreshId
      this.isRefreshing = true

      try {
        const media = await this.requestMedia()

        if (refreshId !== this.refreshId || mediaType !== this.media.type) {
          return media
        }

        this.cacheResults(key, media)
        this.data = priorityResults.length ? this.mergeResults(priorityResults, media) : media
        return media
      } finally {
        if (refreshId === this.refreshId) {
          this.isRefreshing = false
        }
      }
    },
    customLabel({ name }) {
      return `${name}`
    },
    async update() {
      await this.syncRoute()
      await this.fetchData({useCache: false})
    },
    async applyGenreFilters() {
      const key = this.cacheKey()
      const cachedResults = this.resultCache.get(key)

      if (cachedResults) {
        this.data = cachedResults
        await this.syncRoute()
        this.refreshResults(key, cachedResults)
        return
      }

      if (this.hasActiveGenreFilters()) {
        const localMatches = this.localFilterMatches()
        this.data = localMatches
        await this.syncRoute()
        this.refreshResults(key, localMatches)
        return
      }

      await this.syncRoute()
      await this.fetchData({quiet: true})
    },
    async cycleGenre(genre) {
      const included = this.activeGenres() ?? []
      const excluded = this.activeExcludedGenres() ?? []

      if (!included.includes(genre) && !excluded.includes(genre)) {
        this.genre = this.addGenre(included, genre)
        this.excludedGenre = this.removeGenre(excluded, genre)
      } else if (included.includes(genre)) {
        this.genre = this.removeGenre(included, genre)
        this.excludedGenre = this.addGenre(excluded, genre)
      } else {
        this.excludedGenre = this.removeGenre(excluded, genre)
      }

      await this.applyGenreFilters()
    },
    handleGenreClick(genre) {
      clearTimeout(this.genreClickTimer)

      this.genreClickTimer = setTimeout(() => {
        this.cycleGenre(genre)
        this.genreClickTimer = null
      }, 220)
    },
    handleGenreDoubleClick(genre) {
      clearTimeout(this.genreClickTimer)
      this.genreClickTimer = null
      this.isolateGenre(genre)
    },
    async isolateGenre(genre) {
      this.genre = [genre]
      this.excludedGenre = undefined
      await this.applyGenreFilters()
    }
  },
  beforeUnmount() {
    clearTimeout(this.genreClickTimer)
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
h1 {
  text-align: center;
  margin-top: 2rem;
}
.browse-items {
  display: flex;
  flex-flow: row wrap;
  gap: 1.5rem;
  margin: 2rem;
  justify-content: center;
}
.browse-message {
  display: grid;
  place-items: center;
  min-height: 12rem;
  padding: 2rem;
  text-align: center;
}
.browse-message h1 {
  max-width: 65ch;
}
.error-message h1 {
  color: var(--clr-accent-400);
}

.browse-options {
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-around;
  max-width: 100vw;
  position: relative;
}
.refresh-indicator {
  position: absolute;
  inset: auto 2rem .75rem 2rem;
  height: 2px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
.refresh-indicator::before {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(
      90deg,
      transparent,
      var(--clr-secondary-400),
      transparent
  );
  transform: translateX(-100%);
}
.refresh-indicator.active {
  opacity: 1;
}
.refresh-indicator.active::before {
  animation: refresh-progress 1.1s ease-in-out infinite;
}
@keyframes refresh-progress {
  to {
    transform: translateX(250%);
  }
}
.active-filters {
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  gap: .4rem;
  justify-content: center;
}
.filter-chip {
  --genre-h: var(--clr-secondary-h);
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  border: 1px solid hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-border-l) / var(--opacity-7));
  border-radius: 50vw;
  padding: .15rem .45rem;
  cursor: pointer;
  white-space: nowrap;
}
.filter-chip.included {
  border-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-border-l));
  background-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-bg-l) / var(--opacity-7));
  color: hsl(var(--filter-include-text));
  font-weight: 600;
}
.filter-chip.excluded {
  border-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-border-l) / var(--opacity-7));
  border-style: dashed;
  background-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-bg-l) / var(--opacity-5));
  color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-text-l));
  font-weight: 600;
}
.filter-chip.included::before {
  content: '+';
}
.filter-chip.excluded::before {
  content: '-';
}
.genre-action {
  --genre-h: var(--genre-action-h);
}
.genre-adventure {
  --genre-h: var(--genre-adventure-h);
}
.genre-comedy {
  --genre-h: var(--genre-comedy-h);
}
.genre-drama {
  --genre-h: var(--genre-drama-h);
}
.genre-ecchi {
  --genre-h: var(--genre-ecchi-h);
}
.genre-fantasy {
  --genre-h: var(--genre-fantasy-h);
}
.genre-horror {
  --genre-h: var(--genre-horror-h);
}
.genre-mahou-shoujo {
  --genre-h: var(--genre-mahou-shoujo-h);
}
.genre-mecha {
  --genre-h: var(--genre-mecha-h);
}
.genre-music {
  --genre-h: var(--genre-music-h);
}
.genre-mystery {
  --genre-h: var(--genre-mystery-h);
}
.genre-psychological {
  --genre-h: var(--genre-psychological-h);
}
.genre-romance {
  --genre-h: var(--genre-romance-h);
}
.genre-sci-fi {
  --genre-h: var(--genre-sci-fi-h);
}
.genre-slice-of-life {
  --genre-h: var(--genre-slice-of-life-h);
}
.genre-sports {
  --genre-h: var(--genre-sports-h);
}
.genre-supernatural {
  --genre-h: var(--genre-supernatural-h);
}
.genre-thriller {
  --genre-h: var(--genre-thriller-h);
}
.genres {
  width: 17rem;
}
.search {
  max-width: 100%;
}

.search input,
.year input {
  color: var(--clr-text);
  background-color: var(--clr-bg);
  padding: .2rem .5rem;
  border: none;
  border-bottom: 2px solid var(--clr-border);
  outline: none;
  font-size: 1.75rem;
  max-width: 100%;
}
.year input {
  width: 12rem;
  font-size: var(--txt-med);
  padding-block: .45rem;
}
.search input:focus-visible,
.year input:focus-visible {
  box-shadow: 0 10px 0 -5px var(--clr-border);
  border: none;
}

button {
  font-size: var(--txt-med);
  font-weight: 600;
  border-radius: 7px;
  padding: .5rem 1rem;
  border: none;
  outline: none;
  background-color: var(--clr-btn-bg);
  color: var(--clr-btn);
  cursor: pointer;
}

</style>

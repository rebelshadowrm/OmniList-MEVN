<template>
  <section>
    <MediaBrowseControls
        :search="search ?? ''"
        :filter-year="filterYear"
        :year-label="media.yearFilterLabel"
        :sort-types="sortTypes"
        :sort-value="selectedSortValue"
        :supports-genre-filters="supportsGenreFilters()"
        :supports-year-filter="supportsYearFilter()"
        :genres="genres"
        :included-genres="activeGenres() ?? []"
        :excluded-genres="activeExcludedGenres() ?? []"
        :is-refreshing="isRefreshing"
        @search-change="search = $event"
        @year-change="filterYear = $event"
        @sort-change="updateSortValue"
        @apply-filters="applyFilters"
        @cycle-genre="cycleGenre"
        @isolate-genre="isolateGenre"
        @clear-genre-filters="clearGenreFilters"
    />
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
                  :progress-total="item.progressTotal ?? item?.[media.totalField]"
                  :progress-label="media.progressLabel"
                  :media-path="media.path"
                  :genres="item.genres"
                  :is-logged-in="isLoggedIn()"
                  :is-adding="isAdding(item)"
                  :list-item="listItemFor(item)"
                  :active-status="media.activeStatus"
                  :active-status-label="media.activeStatusLabel"
                  :selected-genres="activeGenres() ?? []"
                  :excluded-genres="activeExcludedGenres() ?? []"
                  @genre-clicked="cycleGenre"
                  @genre-isolated="isolateGenre"
                  @quick-add="quickAddToList(item, $event)"
                  @list-entry-change="updateListEntry(item, $event)"
                  @remove-from-list="removeFromList(item)"
      />
    </div>
  </section>
</template>

<script>
import BrowseItem from "../BrowseItem.vue"
import MediaBrowseControls from "./MediaBrowseControls.vue"
import CatalogService from "../../services/CatalogService"
import MediaListService from "../../services/MediaListService"
import useUser from "../../composables/user"
import {useLibraryStore} from "../../stores/libraryStore"
import {mediaConfig, mediaSortOptions} from "../../config/mediaTypes.js"
import {buildLibraryEntryPayload, libraryEntryKey, mediaExternalId} from "../../utils/libraryPayload"

export default {
  name: "MediaBrowseView",
  components: {
    BrowseItem,
    MediaBrowseControls,
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
      skipNextRouteFetch: false,
      resultCache: new Map(),
      addingKeys: {},
    }
  },
  async created() {
    this.loading = true
    await this.loadLibraryItems()
    await this.loadGenreOptions()
    this.hydrateFiltersFromRoute()
    await this.fetchData()
  },
  computed: {
    media() {
      return mediaConfig(this.mediaType)
    },
    sortTypes() {
      return this.sortTypesForSearch()
    },
    selectedSortValue: {
      get() {
        return this.activeSort()
      },
      set(value) {
        this.sortBy = this.sortTypes.find(type => type.value === value) ?? this.sortTypes[0]
      },
    },
  },
  watch: {
    async mediaType() {
      this.data = []
      this.errorMessage = ''
      this.loading = true
      await this.loadLibraryItems()
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
    libraryStore() {
      return useLibraryStore()
    },
    currentUser() {
      const {getUser} = useUser()

      return getUser().value?.user
    },
    isLoggedIn() {
      const {getIsLoggedIn} = useUser()

      return getIsLoggedIn().value
    },
    itemKey(item) {
      return libraryEntryKey(item, this.media.type)
    },
    listItemFor(item) {
      const store = this.libraryStore()
      const key = this.itemKey(item)

      return key ? store.itemsByKey[key] ?? null : null
    },
    isAdding(item) {
      const key = this.itemKey(item)

      return key ? !!this.addingKeys[key] : false
    },
    setAdding(item, value) {
      const key = this.itemKey(item)
      if (!key) {
        return
      }

      this.addingKeys = {
        ...this.addingKeys,
        [key]: value,
      }
    },
    setLibraryItem(item) {
      const key = libraryEntryKey(item, item?.mediaType ?? this.media.type)
      if (key) {
        this.libraryStore().setItem(key, item)
      }
    },
    async loadLibraryItems() {
      if (!this.isLoggedIn()) {
        return
      }

      const user = this.currentUser()
      if (!user?._id) {
        return
      }

      try {
        const list = await MediaListService.getUserMediaList(user._id, this.media.type)
        list.forEach(item => this.setLibraryItem(item))
      } catch (err) {
        console.log(err.message)
      }
    },
    updateSortValue(value) {
      this.selectedSortValue = value
    },
    sortTypesForSearch(search = this.activeSearch()) {
      return mediaSortOptions(this.mediaType, {search})
    },
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
      try {
        const data = await CatalogService.genres(this.media.catalogPath)
        this.genres = data.map(genre => genre.name)
      } catch (err) {
        console.log(err.message)
        this.genres = [...(this.media.genreOptions ?? [])]
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
    querySort(value, search = this.activeSearch()) {
      const sort = this.queryValue(value)
      const sortTypes = this.sortTypesForSearch(search)

      return sortTypes.find(type => type.value === sort) ?? sortTypes.find(type => type.value === this.defaultSortValue()) ?? sortTypes[0]
    },
    queryYear(value) {
      if (!this.supportsYearFilter()) {
        return null
      }

      const year = Number(this.queryValue(value))

      return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null
    },
    normalizedQuery(query = this.$route.query) {
      const search = (this.queryValue(query.search) ?? this.queryValue(query.q))?.trim() || null
      const genres = this.queryGenres(query.genre)
      const excludedGenres = this.queryGenres(query.exclude)
      const sort = this.querySort(query.sort, search).value
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
      this.sortBy = this.querySort(query.sort, query.search)
      this.normalizeSearchAwareSort()
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
    normalizeSearchAwareSort() {
      if (this.media.type !== 'BOOK') {
        return
      }

      if (!this.activeSearch() && this.sortBy?.value === 'relevance') {
        this.sortBy = this.sortTypes.find(type => type.value === this.defaultSortValue()) ?? this.sortTypes[0]
        return
      }

      if (this.activeSearch() && !this.sortBy) {
        this.sortBy = this.sortTypes[0]
      }
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

      try {
        return await CatalogService.search(this.media.catalogPath, {
          search,
          genre: genres,
          exclude: excludedGenres,
          sort,
          year,
        })
      } catch(err) {
        console.log(err.message)
        this.errorMessage = err.message
        return []
      }
    },
    async quickAddToList(item, values = {}) {
      const user = this.currentUser()
      if (!user?._id) {
        return
      }

      this.setAdding(item, true)
      try {
        const payload = {
          ...buildLibraryEntryPayload({
            userId: user._id,
            mediaType: this.media.type,
            catalogItem: item,
          }),
          status: values.status ?? this.media.activeStatus,
          progress: values.progress ?? 0,
        }
        const res = await MediaListService.createMediaListItem(payload)
        if (res?.status === 201 && res.data) {
          this.setLibraryItem(res.data)
        }
      } catch (err) {
        console.log(err.message)
      } finally {
        this.setAdding(item, false)
      }
    },
    async updateListEntry(item, values = {}) {
      const user = this.currentUser()
      const listItem = this.listItemFor(item)
      const externalId = mediaExternalId(listItem) || mediaExternalId(item)
      if (!user?._id || !listItem || !externalId) {
        return
      }

      let progress = Number.parseInt(values.progress, 10)
      if (Number.isNaN(progress) || progress < 0) {
        progress = 0
      }

      const data = {
        status: values.status ?? listItem.status,
        progress,
      }

      try {
        const res = await MediaListService.updateMediaListItem(user._id, this.media.type, externalId, data)
        if (res?.status === 200) {
          this.setLibraryItem({...listItem, ...data})
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async removeFromList(item) {
      const listItem = this.listItemFor(item)
      if (!listItem?._id) {
        return
      }

      try {
        const res = await MediaListService.deleteMediaListItem(listItem._id)
        if (res?.status === 204) {
          const key = libraryEntryKey(listItem, this.media.type)
          if (key) {
            this.libraryStore().removeItem(key)
          }
        }
      } catch (err) {
        console.log(err.message)
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
    async applyFilters() {
      this.normalizeSearchAwareSort()
      const routeChanged = await this.syncRoute()
      if (routeChanged) {
        await this.fetchData({quiet: true})
      }
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
    async isolateGenre(genre) {
      this.genre = [genre]
      this.excludedGenre = undefined
      await this.applyGenreFilters()
    },
    async clearGenreFilters() {
      this.genre = undefined
      this.excludedGenre = undefined
      await this.applyGenreFilters()
    },
  },
}
</script>

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
</style>

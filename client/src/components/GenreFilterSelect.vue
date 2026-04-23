<template>
  <div ref="root" class="genre-filter" :class="{open: isOpen}">
    <label class="genre-label" :for="inputId">{{ label }}</label>
    <div class="genre-control" @click="openMenu">
      <div v-if="selectedChips.length" class="selected-genres">
        <button v-for="chip in selectedChips"
                :key="`${chip.state}-${chip.genre}`"
                :class="['genre-filter-chip', genreClass(chip.genre), chip.state]"
                type="button"
                @click.stop="handleGenreClick(chip.genre)"
                @dblclick.stop="handleGenreDoubleClick(chip.genre)">
          <span>{{ chip.genre }}</span>
        </button>
      </div>
      <input :id="inputId"
             ref="searchInput"
             v-model="search"
             class="genre-search"
             type="search"
             autocomplete="off"
             :placeholder="selectedChips.length ? '' : placeholder"
             :aria-expanded="isOpen"
             :aria-controls="listId"
             role="combobox"
             @focus="openMenu"
             @keydown="handleSearchKeydown">
      <button v-if="selectedChips.length"
              class="clear-btn"
              type="button"
              aria-label="Clear genre filters"
              @click.stop="clearFilters">
        <i class="fas fa-times"></i>
      </button>
      <button class="toggle-btn"
              type="button"
              :aria-expanded="isOpen"
              aria-label="Toggle genre menu"
              @click.stop="toggleMenu">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div v-if="isOpen" :id="listId" class="genre-menu" role="listbox">
      <button v-for="(genre, index) in filteredOptions"
              :key="genre"
              :class="['genre-option', genreClass(genre), stateFor(genre), {highlighted: index === highlightedIndex}]"
              type="button"
              role="option"
              :aria-selected="stateFor(genre) !== 'neutral'"
              @mouseenter="highlightedIndex = index"
              @click="handleGenreClick(genre)"
              @dblclick="handleGenreDoubleClick(genre)">
        <span class="state-marker" aria-hidden="true">{{ markerFor(genre) }}</span>
        <span class="genre-name">{{ genre }}</span>
      </button>
      <p v-if="filteredOptions.length === 0" class="empty-message">No genres found.</p>
    </div>
  </div>
</template>

<script>
let filterId = 0

export default {
  name: 'GenreFilterSelect',
  emits: ['genre-clicked', 'genre-isolated', 'clear'],
  props: {
    label: {
      type: String,
      default: 'Genres',
    },
    placeholder: {
      type: String,
      default: 'Filter by genre',
    },
    options: {
      type: Array,
      default: () => [],
    },
    included: {
      type: Array,
      default: () => [],
    },
    excluded: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    filterId += 1

    return {
      inputId: `genre-filter-${filterId}`,
      listId: `genre-filter-list-${filterId}`,
      isOpen: false,
      search: '',
      highlightedIndex: 0,
      genreClickTimer: null,
    }
  },
  computed: {
    includedGenres() {
      return this.included ?? []
    },
    excludedGenres() {
      return this.excluded ?? []
    },
    selectedChips() {
      return [
        ...this.includedGenres.map(genre => ({genre, state: 'included'})),
        ...this.excludedGenres.map(genre => ({genre, state: 'excluded'})),
      ]
    },
    filteredOptions() {
      const query = this.search.trim().toLowerCase()
      const options = [...this.options].sort((a, b) => a.localeCompare(b))

      if (!query) return options

      return options.filter(genre => genre.toLowerCase().includes(query))
    },
  },
  watch: {
    filteredOptions() {
      this.highlightedIndex = 0
    },
  },
  mounted() {
    document.addEventListener('pointerdown', this.handleDocumentPointerDown)
  },
  beforeUnmount() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown)
    clearTimeout(this.genreClickTimer)
  },
  methods: {
    openMenu() {
      this.isOpen = true
      this.$nextTick(() => this.$refs.searchInput?.focus())
    },
    closeMenu() {
      this.isOpen = false
      this.search = ''
    },
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu()
        return
      }

      this.openMenu()
    },
    handleDocumentPointerDown(event) {
      if (!this.$refs.root?.contains(event.target)) {
        this.closeMenu()
      }
    },
    handleSearchKeydown(event) {
      if (event.key === 'Escape') {
        this.closeMenu()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (this.filteredOptions.length === 0) return
        this.isOpen = true
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (this.filteredOptions.length === 0) return
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0)
        return
      }

      if (event.key === 'Enter' && this.filteredOptions[this.highlightedIndex]) {
        event.preventDefault()
        const genre = this.filteredOptions[this.highlightedIndex]
        if (event.shiftKey) {
          this.emitIsolated(genre)
        } else {
          this.emitClicked(genre)
        }
      }
    },
    handleGenreClick(genre) {
      clearTimeout(this.genreClickTimer)

      this.genreClickTimer = setTimeout(() => {
        this.emitClicked(genre)
      }, 220)
    },
    handleGenreDoubleClick(genre) {
      clearTimeout(this.genreClickTimer)
      this.emitIsolated(genre)
    },
    emitClicked(genre) {
      this.$emit('genre-clicked', genre)
      this.genreClickTimer = null
      this.openMenu()
    },
    emitIsolated(genre) {
      this.$emit('genre-isolated', genre)
      this.genreClickTimer = null
      this.search = ''
      this.openMenu()
    },
    clearFilters() {
      this.$emit('clear')
      this.search = ''
      this.openMenu()
    },
    stateFor(genre) {
      if (this.includedGenres.includes(genre)) return 'included'
      if (this.excludedGenres.includes(genre)) return 'excluded'
      return 'neutral'
    },
    markerFor(genre) {
      const state = this.stateFor(genre)
      if (state === 'included') return '+'
      if (state === 'excluded') return '-'
      return ''
    },
    genreClass(genre) {
      return `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    },
  },
}
</script>

<style scoped>
.genre-filter {
  position: relative;
  width: 100%;
}

.genre-label {
  display: block;
  margin-bottom: .25rem;
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 700;
}

.genre-control {
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  align-items: center;
  gap: .35rem;
  min-height: 3rem;
  padding: .35rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background-color: var(--clr-secondary-800-3);
}

.selected-genres {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
  min-width: 0;
}

.genre-search {
  grid-column: 1 / 2;
  min-width: 8rem;
  width: 100%;
  border: none;
  outline: none;
  color: var(--clr-text);
  background: transparent;
}

.genre-search::-webkit-search-cancel-button {
  display: none;
}

.clear-btn,
.toggle-btn {
  display: grid;
  place-items: center;
  width: 2rem;
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius-xs);
  color: var(--clr-text);
  background: transparent;
  cursor: pointer;
}

.clear-btn:hover,
.toggle-btn:hover {
  background: var(--clr-secondary-200-1);
}

.open .toggle-btn {
  color: var(--clr-primary-200);
}

.genre-menu {
  position: absolute;
  z-index: 5;
  inset: calc(100% + .35rem) 0 auto 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: .4rem;
  max-height: min(55vh, 24rem);
  padding: .55rem;
  overflow-y: auto;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background: var(--clr-bg);
  box-shadow: 0 .75rem 1.5rem hsl(var(--clr-black) / .35);
}

.genre-option {
  --genre-h: var(--clr-secondary-h);
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  max-width: 100%;
  padding: .25rem .55rem;
  border: 1px solid hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-border-l) / var(--opacity-5));
  border-radius: 50vw;
  color: var(--clr-text);
  background: hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-bg-l) / var(--opacity-1));
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}

.genre-option.highlighted,
.genre-option:hover {
  border-color: hsl(var(--genre-h) var(--filter-neutral-s) 58% / var(--opacity-7));
  background: hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-bg-l) / var(--opacity-3));
}

.genre-option.included {
  border-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-border-l));
  background-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-bg-l) / var(--opacity-7));
  color: hsl(var(--filter-include-text));
  font-weight: 600;
}

.genre-option.excluded {
  border-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-border-l) / var(--opacity-7));
  border-style: dashed;
  background-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-bg-l) / var(--opacity-5));
  color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-text-l));
  font-weight: 600;
}

.state-marker {
  display: none;
  place-items: center;
  min-width: 1rem;
  font-weight: 800;
}

.included .state-marker,
.excluded .state-marker {
  display: grid;
}

.genre-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.genre-filter-chip {
  --genre-h: var(--clr-secondary-h);
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  border: 1px solid hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-border-l) / var(--opacity-7));
  border-radius: 50vw;
  padding: .15rem .45rem;
  color: var(--clr-text);
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.genre-filter-chip.included {
  border-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-border-l));
  background-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-bg-l) / var(--opacity-7));
  color: hsl(var(--filter-include-text));
  font-weight: 600;
}

.genre-filter-chip.excluded {
  border-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-border-l) / var(--opacity-7));
  border-style: dashed;
  background-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-bg-l) / var(--opacity-5));
  color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-text-l));
  font-weight: 600;
}

.genre-filter-chip.included::before {
  content: '+';
}

.genre-filter-chip.excluded::before {
  content: '-';
}

.empty-message {
  padding: 1rem;
  text-align: center;
  font-size: var(--txt-small);
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

@media (max-width: 42rem) {
  .genre-search {
    min-width: 0;
  }

  .genre-menu {
    max-height: 60vh;
  }
}
</style>

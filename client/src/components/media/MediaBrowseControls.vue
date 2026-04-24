<template>
  <div class="browse-options">
    <div class="search">
      <input :value="search"
             type="text"
             name="search"
             id="search"
             placeholder="search"
             @input="$emit('search-change', $event.target.value)"
             @keydown.enter.prevent="$emit('apply-filters')"
             @blur="$emit('apply-filters')">
    </div>
    <div v-if="supportsGenreFilters" class="genres">
      <GenreFilterSelect
          :options="genres"
          :included="includedGenres"
          :excluded="excludedGenres"
          @genre-clicked="$emit('cycle-genre', $event)"
          @genre-isolated="$emit('isolate-genre', $event)"
          @clear="$emit('clear-genre-filters')"
      />
    </div>
    <div class="filter-tools">
      <div v-if="supportsYearFilter" class="year">
        <YearFilterSelect
            :model-value="filterYear"
            :label="yearLabel"
            :placeholder="yearLabel"
            :min="1900"
            :max="2100"
            @update:modelValue="$emit('year-change', $event)"
            @commit="$emit('apply-filters')"
        />
      </div>
      <div class="sort-by">
        <label for="sort-by">Sort</label>
        <select id="sort-by" :value="sortValue" @change="updateSort">
          <option v-for="sort in sortTypes" :key="sort.value" :value="sort.value">
            {{ sort.name }}
          </option>
        </select>
      </div>
    </div>
    <span class="refresh-indicator" :class="{active: isRefreshing}" aria-hidden="true"></span>
  </div>
</template>

<script>
import GenreFilterSelect from "../GenreFilterSelect.vue"
import YearFilterSelect from "../YearFilterSelect.vue"

export default {
  name: "MediaBrowseControls",
  components: {
    GenreFilterSelect,
    YearFilterSelect,
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    filterYear: [Number, String],
    yearLabel: {
      type: String,
      default: '',
    },
    sortTypes: {
      type: Array,
      default: () => [],
    },
    sortValue: {
      type: String,
      default: '',
    },
    supportsGenreFilters: Boolean,
    supportsYearFilter: Boolean,
    genres: {
      type: Array,
      default: () => [],
    },
    includedGenres: {
      type: Array,
      default: () => [],
    },
    excludedGenres: {
      type: Array,
      default: () => [],
    },
    isRefreshing: Boolean,
  },
  emits: [
    'search-change',
    'year-change',
    'sort-change',
    'apply-filters',
    'cycle-genre',
    'isolate-genre',
    'clear-genre-filters',
  ],
  methods: {
    updateSort(event) {
      this.$emit('sort-change', event.target.value)
      this.$emit('apply-filters')
    },
  },
}
</script>

<style scoped>
.browse-options {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
      "search"
      "genres"
      "tools";
  gap: 1rem;
  align-items: end;
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

.genres {
  grid-area: genres;
  min-width: 0;
}

.year {
  width: 100%;
  max-width: 100%;
}

.search {
  grid-area: search;
  max-width: 100%;
}

.filter-tools {
  grid-area: tools;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  align-items: end;
}

.sort-by {
  display: grid;
  gap: .25rem;
}

.search input,
.sort-by select {
  width: 100%;
  color: var(--clr-text);
  background-color: var(--clr-bg);
  padding: .2rem .5rem;
  border: none;
  border-bottom: 2px solid var(--clr-border);
  outline: none;
  font-size: 1.75rem;
  max-width: 100%;
}

.sort-by select {
  width: 12rem;
  font-size: var(--txt-med);
  padding-block: .45rem;
}

.sort-by label {
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 700;
}

.sort-by select {
  appearance: none;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background:
      linear-gradient(45deg, transparent 50%, var(--clr-text) 50%) calc(100% - .85rem) 50% / .35rem .35rem no-repeat,
      linear-gradient(135deg, var(--clr-text) 50%, transparent 50%) calc(100% - .6rem) 50% / .35rem .35rem no-repeat,
      var(--clr-bg);
  padding-inline-end: 1.75rem;
}

.search input:focus-visible,
.sort-by select:focus-visible {
  box-shadow: 0 10px 0 -5px var(--clr-border);
}

@media (min-width: 48rem) {
  .browse-options {
    grid-template-columns: minmax(0, 1fr) max-content;
    grid-template-areas:
        "search search"
        "genres tools";
  }

  .filter-tools {
    grid-template-columns: 18rem 12rem;
    align-self: start;
  }

  .year {
    width: 100%;
  }

  .sort-by select {
    width: 100%;
  }
}

@media (min-width: 68rem) {
  .browse-options {
    grid-template-columns: minmax(12rem, .8fr) minmax(18rem, 1.4fr) max-content;
    grid-template-areas: "search genres tools";
  }

  .filter-tools {
    align-self: end;
  }
}

@media (max-width: 47.99rem) {
  .browse-options {
    padding: 1rem;
  }

  .sort-by select {
    width: 100%;
  }
}
</style>

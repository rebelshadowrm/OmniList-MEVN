<template>
  <div ref="root" class="year-filter" :class="{open: isOpen}">
    <label class="year-label" :for="inputId">{{ label }}</label>
    <div class="year-control">
      <input :id="inputId"
             ref="yearInput"
             v-model="draftYear"
             type="text"
             inputmode="numeric"
             autocomplete="off"
             :placeholder="placeholder"
             @focus="openMenu"
             @keydown.enter.prevent="commitTypedYear"
             @keydown.escape="closeMenu"
             @blur="commitTypedYear">
      <button v-if="selectedYear"
              class="clear-btn"
              type="button"
              aria-label="Clear year filter"
              @pointerdown.prevent
              @click="clearYear">
        <i class="fas fa-times"></i>
      </button>
      <button class="toggle-btn"
              type="button"
              :aria-expanded="isOpen"
              aria-label="Toggle year picker"
              @pointerdown.prevent
              @click="toggleMenu">
        <i class="fas fa-calendar-alt"></i>
      </button>
    </div>
    <div v-if="isOpen" class="year-menu">
      <div class="year-menu-header">
        <button type="button"
                aria-label="Previous decade"
                @pointerdown.prevent
                @click="shiftDecade(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>{{ decadeStart }}-{{ decadeEnd }}</span>
        <button type="button"
                aria-label="Next decade"
                @pointerdown.prevent
                @click="shiftDecade(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="year-grid" role="listbox">
        <button v-for="year in visibleYears"
                :key="year"
                :class="{selected: year === selectedYear}"
                type="button"
                role="option"
                :aria-selected="year === selectedYear"
                @pointerdown.prevent
                @click="selectYear(year)">
          {{ year }}
        </button>
      </div>
      <button class="clear-year-btn"
              type="button"
              @pointerdown.prevent
              @click="clearYear">
        Any year
      </button>
    </div>
  </div>
</template>

<script>
let yearFilterId = 0

export default {
  name: 'YearFilterSelect',
  emits: ['update:modelValue', 'commit'],
  props: {
    modelValue: [Number, String],
    label: {
      type: String,
      default: 'Year',
    },
    placeholder: {
      type: String,
      default: 'Year',
    },
    min: {
      type: Number,
      default: 1900,
    },
    max: {
      type: Number,
      default: 2100,
    },
  },
  data() {
    yearFilterId += 1

    return {
      inputId: `year-filter-${yearFilterId}`,
      isOpen: false,
      draftYear: this.modelValue ? `${this.modelValue}` : '',
      decadeStart: this.initialDecadeStart(),
    }
  },
  computed: {
    selectedYear() {
      return this.normalizeYear(this.modelValue)
    },
    decadeEnd() {
      return Math.min(this.decadeStart + 9, this.max)
    },
    visibleYears() {
      const years = []
      const start = Math.max(this.decadeStart, this.min)
      const end = Math.min(this.decadeStart + 9, this.max)

      for (let year = start; year <= end; year += 1) {
        years.push(year)
      }

      return years
    },
  },
  watch: {
    modelValue() {
      this.draftYear = this.modelValue ? `${this.modelValue}` : ''
      const selectedYear = this.selectedYear
      if (selectedYear) {
        this.decadeStart = this.decadeStartFor(selectedYear)
      }
    },
  },
  mounted() {
    document.addEventListener('pointerdown', this.handleDocumentPointerDown)
  },
  beforeUnmount() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown)
  },
  methods: {
    initialDecadeStart() {
      const selectedYear = this.normalizeYear(this.modelValue)
      const currentYear = new Date().getFullYear()
      const baseYear = selectedYear ?? Math.min(Math.max(currentYear, this.min), this.max)

      return this.decadeStartFor(baseYear)
    },
    decadeStartFor(year) {
      const decade = Math.floor(Number(year) / 10) * 10

      return Math.min(Math.max(decade, this.min), Math.max(this.min, this.max - 9))
    },
    normalizeYear(value) {
      const year = Number(value)

      return Number.isInteger(year) && year >= this.min && year <= this.max ? year : null
    },
    openMenu() {
      this.isOpen = true
    },
    closeMenu() {
      this.isOpen = false
    },
    toggleMenu() {
      this.isOpen ? this.closeMenu() : this.openMenu()
      this.$nextTick(() => this.$refs.yearInput?.focus())
    },
    handleDocumentPointerDown(event) {
      if (!this.$refs.root?.contains(event.target)) {
        this.commitTypedYear()
        this.closeMenu()
      }
    },
    shiftDecade(direction) {
      const nextStart = this.decadeStart + direction * 10
      this.decadeStart = Math.min(Math.max(nextStart, this.min), Math.max(this.min, this.max - 9))
    },
    selectYear(year) {
      this.draftYear = `${year}`
      this.$emit('update:modelValue', year)
      this.$emit('commit')
      this.closeMenu()
    },
    clearYear() {
      this.draftYear = ''
      this.$emit('update:modelValue', undefined)
      this.$emit('commit')
      this.closeMenu()
    },
    commitTypedYear() {
      const trimmedYear = this.draftYear.trim()

      if (!trimmedYear) {
        if (this.modelValue !== undefined) {
          this.$emit('update:modelValue', undefined)
          this.$emit('commit')
        }
        return
      }

      const year = this.normalizeYear(trimmedYear)

      if (!year) {
        this.draftYear = this.modelValue ? `${this.modelValue}` : ''
        return
      }

      this.draftYear = `${year}`
      this.decadeStart = this.decadeStartFor(year)
      this.$emit('update:modelValue', year)
      this.$emit('commit')
    },
  },
}
</script>

<style scoped>
.year-filter {
  position: relative;
  width: 100%;
}

.year-label {
  display: block;
  margin-bottom: .25rem;
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 700;
}

.year-control {
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  align-items: center;
  gap: .25rem;
  min-height: 2.75rem;
  padding-inline: .35rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background-color: var(--clr-bg);
}

.year-control:focus-within {
  box-shadow: 0 10px 0 -5px var(--clr-border);
}

.year-control input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  color: var(--clr-text);
  background: transparent;
  font-size: var(--txt-med);
}

.clear-btn,
.toggle-btn,
.year-menu-header button,
.clear-year-btn {
  display: grid;
  place-items: center;
  border: none;
  border-radius: var(--radius-xs);
  color: var(--clr-text);
  background: transparent;
  cursor: pointer;
}

.clear-btn,
.toggle-btn {
  width: 2rem;
  aspect-ratio: 1;
}

.clear-btn:hover,
.toggle-btn:hover,
.year-menu-header button:hover,
.clear-year-btn:hover {
  background: var(--clr-secondary-200-1);
}

.year-menu {
  position: absolute;
  z-index: 4;
  inset: calc(100% + .35rem) 0 auto 0;
  display: grid;
  gap: .5rem;
  padding: .6rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background: var(--clr-bg);
  box-shadow: 0 .75rem 1.5rem hsl(var(--clr-black) / .35);
}

.year-menu-header {
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;
  align-items: center;
  gap: .5rem;
}

.year-menu-header span {
  text-align: center;
  color: var(--clr-primary-200);
  font-weight: 700;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(4.25rem, 1fr));
  gap: .35rem;
}

.year-grid button {
  min-height: 2.25rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xs);
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  cursor: pointer;
}

.year-grid button:hover,
.year-grid button.selected {
  border-color: var(--clr-primary-200);
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
  font-weight: 700;
}

.clear-year-btn {
  justify-self: center;
  padding: .35rem .65rem;
  font-weight: 700;
}
</style>

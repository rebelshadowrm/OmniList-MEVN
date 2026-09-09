<template>
  <section class="media-section"
           :data-cols="cols"
           :data-rows="rows"
           :data-layout="layoutVariant">
    <div class="section-heading">
      <div>
        <p>{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <router-link :to="{name: media.browseRoute}">
        View all
        <i class="fas fa-arrow-right"></i>
      </router-link>
    </div>

    <div v-if="loading" class="media-grid loading-grid">
      <div v-for="index in resolvedLimit" :key="index" class="media-card skeleton"></div>
    </div>
    <div v-else-if="items.length" class="media-grid">
      <HomeMediaCard
          v-for="item in displayItems"
          :key="item.id"
          :item="item"
          :media="media"
          :variant="layoutVariant" />
    </div>
    <div v-else class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<script>
import {mediaConfig} from "../../config/mediaTypes"
import HomeMediaCard from "./HomeMediaCard.vue"

export default {
  name: "HomeMediaSection",
  components: {HomeMediaCard},
  props: {
    mediaType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    eyebrow: {
      type: String,
      default: 'Trending',
    },
    sort: {
      type: String,
      default: null,
    },
    limit: {
      type: Number,
      default: null,
    },
    cols: {
      type: Number,
      default: 2,
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      items: [],
      loading: true,
      errorMessage: '',
    }
  },
  computed: {
    media() {
      return mediaConfig(this.mediaType)
    },
    displayItems() {
      return this.items.slice(0, this.resolvedLimit)
    },
    emptyMessage() {
      return this.errorMessage || `No ${this.media.noun} results available.`
    },
    resolvedLimit() {
      if (Number.isInteger(this.limit) && this.limit > 0) {
        return this.limit
      }

      const key = `${this.cols}x${this.rows}`
      return {
        '1x1': 1,
        '1x2': 2,
        '2x1': 2,
        '2x2': 4,
        '3x1': 3,
        '3x2': 6,
      }[key] ?? 3
    },
    layoutVariant() {
      if (this.cols === 1 && this.rows === 1) return 'compact'
      if (this.rows === 1) return 'strip'

      return 'gallery'
    },
  },
  async created() {
    await this.loadMedia()
  },
  watch: {
    mediaType: 'loadMedia',
    sort: 'loadMedia',
  },
  methods: {
    async loadMedia() {
      this.loading = true
      this.errorMessage = ''

      try {
        this.items = await this.loadCatalogMedia()
      } catch (err) {
        this.errorMessage = err.message
        this.items = []
      } finally {
        this.loading = false
      }
    },
    async loadCatalogMedia() {
      const params = new URLSearchParams({
        sort: this.sort ?? this.media.defaultSort,
        limit: `${this.resolvedLimit}`,
      })
      const res = await fetch(`/api/catalog/${this.media.catalogPath}/search?${params.toString()}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message ?? res.statusText)
      }

      return json ?? []
    },
  },
}
</script>

<style scoped>
.media-section {
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr);
  align-content: start;
  gap: .85rem;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading p {
  color: var(--clr-primary-200);
  font-size: var(--txt-small);
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  color: var(--clr-text);
  font-size: var(--txt-med);
}

.section-heading a {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  color: var(--clr-primary-200);
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.media-grid {
  display: grid;
  gap: .85rem;
  min-height: 0;
  overflow: hidden;
}

.media-section[data-layout="compact"] .media-grid {
  grid-template-columns: 1fr;
  grid-template-rows: minmax(0, 1fr);
}

.media-section[data-layout="strip"] .media-grid,
.media-section[data-layout="gallery"] .media-grid {
  --media-columns: 2;
  grid-template-columns: repeat(var(--media-columns), minmax(0, 1fr));
}

.media-section[data-layout="strip"] .media-grid {
  grid-template-rows: minmax(0, 1fr);
}

.media-section[data-layout="gallery"] .media-grid {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.media-section[data-cols="1"] .media-grid {
  --media-columns: 1;
}

.media-section[data-cols="2"] .media-grid {
  --media-columns: 2;
}

.media-section[data-cols="3"] .media-grid {
  --media-columns: 3;
}

.skeleton {
  min-height: 10rem;
  background: linear-gradient(
      100deg,
      var(--clr-secondary-800-3),
      var(--clr-secondary-600-3),
      var(--clr-secondary-800-3)
  );
  background-size: 200% 100%;
  animation: loading-pulse 1.4s ease-in-out infinite;
}

.empty-state {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  background: var(--clr-secondary-800-3);
}

@keyframes loading-pulse {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 42rem) {
  .media-section[data-layout="compact"] .media-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 58rem) {
  .media-section[data-layout="strip"] .media-grid,
  .media-section[data-layout="gallery"] .media-grid {
    grid-template-columns: none;
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    grid-auto-columns: minmax(16rem, 82vw);
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: .35rem;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
  }
}
</style>

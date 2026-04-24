<template>
  <section class="media-section" :data-cols="cols" :data-rows="rows">
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
      <router-link v-for="item in displayItems"
                   :key="item.id"
                   class="media-card"
                   :to="`/${media.path}/${item.id}`">
        <img :src="imageSrc(item.coverImage?.large, itemTitle(item))"
             :alt="itemTitle(item)"
             loading="lazy"
             @error="setFallbackImage($event, itemTitle(item))">
        <div class="media-card-body">
          <h3>{{ itemTitle(item) }}</h3>
          <p>{{ itemSummary(item) }}</p>
        </div>
      </router-link>
    </div>
    <div v-else class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<script>
import {mediaConfig} from "../../config/mediaTypes"
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages"

export default {
  name: "HomeMediaSection",
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
        '1x2': 3,
        '2x1': 2,
        '2x2': 4,
        '3x1': 3,
        '3x2': 6,
      }[key] ?? 3
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
    imageSrc(src, label) {
      return imageOrFallback(src, 'poster', label)
    },
    setFallbackImage(event, label) {
      useFallbackImage(event, 'poster', label)
    },
    itemTitle(item) {
      return item?.title?.english ?? item?.title?.romaji ?? item?.title?.native ?? 'Untitled'
    },
    itemSummary(item) {
      const text = `${item?.description ?? ''}`.replace(/<[^>]*>/g, '').trim()
      if (!text) return item?.genres?.slice(0, 3).join(' / ') ?? this.media.label
      return text.length > 110 ? `${text.slice(0, 107)}...` : text
    },
    async loadMedia() {
      this.loading = true
      this.errorMessage = ''

      try {
        this.items = this.media.source === 'TMDB'
            ? await this.loadTmdbMedia()
            : await this.loadAniListMedia()
      } catch (err) {
        this.errorMessage = err.message
        this.items = []
      } finally {
        this.loading = false
      }
    },
    async loadTmdbMedia() {
      const params = new URLSearchParams({sort: this.sort ?? this.media.defaultSort})
      const res = await fetch(`/api/tmdb/${this.media.path}/search?${params.toString()}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message ?? res.statusText)
      }

      return json ?? []
    },
    async loadAniListMedia() {
      const query = `
        query ($type: MediaType, $sort: [MediaSort]) {
          Page(page: 1, perPage: 8) {
            media(type: $type, sort: $sort) {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                large
              }
              description
              genres
              averageScore
            }
          }
        }
      `
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            type: this.media.type,
            sort: [this.sort ?? this.media.defaultSort],
          },
        }),
      })
      const json = await res.json()

      if (!res.ok || json.errors?.length) {
        throw new Error(json.errors?.map(error => error.message).join(', ') ?? res.statusText)
      }

      return json.data?.Page?.media ?? []
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
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: .85rem;
  min-height: 0;
  overflow: hidden;
}

.media-section[data-cols="1"] .media-grid {
  grid-template-columns: 1fr;
}

.media-section[data-cols="2"][data-rows="1"] .media-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.media-section[data-cols="3"][data-rows="1"] .media-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.media-section[data-cols="2"][data-rows="2"] .media-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.media-section[data-cols="3"][data-rows="2"] .media-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.media-section[data-rows="1"] .media-card,
.media-section[data-cols="1"] .media-card {
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
}

.media-section[data-rows="1"] .media-card img,
.media-section[data-cols="1"] .media-card img {
  width: 3.25rem;
  height: 100%;
  min-height: 4.75rem;
  aspect-ratio: auto;
}

.media-section[data-rows="1"] .media-card-body,
.media-section[data-cols="1"] .media-card-body {
  align-content: center;
}

.media-section[data-rows="1"] .media-card-body p,
.media-section[data-cols="1"] .media-card-body p {
  display: none;
}

.media-card {
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  text-decoration: none;
}

.media-card img {
  width: 100%;
  min-height: 0;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  background: var(--clr-bg);
}

.media-card-body {
  display: grid;
  gap: .25rem;
  padding: .6rem;
  min-height: 0;
  overflow: hidden;
}

h3 {
  font-size: var(--txt-small);
  line-height: 1.2;
}

.media-card-body p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: var(--txt-small);
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
  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .media-section[data-cols="1"] .media-grid {
    grid-template-columns: 1fr;
  }
}
</style>

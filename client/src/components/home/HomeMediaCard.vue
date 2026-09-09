<template>
  <router-link
      class="home-media-card"
      :class="[`is-${variant}`, {'uses-poster-art': usesPosterArt}]"
      :to="detailPath"
      :aria-label="accessibleLabel">
    <div class="card-art" aria-hidden="true">
      <img
          :src="imageSrc"
          :alt="title"
          loading="lazy"
          @error="setFallbackImage">
    </div>

    <div class="card-content">
      <h3>{{ title }}</h3>
      <div v-if="metadata.length" class="card-meta">
        <span v-for="entry in metadata" :key="entry">{{ entry }}</span>
      </div>
      <p class="card-summary">{{ summary }}</p>
    </div>
  </router-link>
</template>

<script>
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages"

export default {
  name: "HomeMediaCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    media: {
      type: Object,
      required: true,
    },
    variant: {
      type: String,
      default: 'compact',
      validator: value => ['compact', 'strip', 'gallery'].includes(value),
    },
  },
  computed: {
    detailPath() {
      return `/${this.media.path}/${this.item.id}`
    },
    title() {
      return this.item?.title?.english
          ?? this.item?.title?.romaji
          ?? this.item?.title?.native
          ?? 'Untitled'
    },
    usesPosterArt() {
      return this.variant === 'compact'
          || this.media.type === 'BOOK'
          || !this.item?.bannerImage
    },
    imageType() {
      return this.usesPosterArt ? 'poster' : 'banner'
    },
    imageSrc() {
      const source = this.usesPosterArt
        ? this.item?.coverImage?.large
        : this.item?.bannerImage

      return imageOrFallback(source, this.imageType, this.title)
    },
    summary() {
      const description = `${this.item?.description ?? ''}`
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      if (description) return description
      if (this.item?.genres?.length) return this.item.genres.slice(0, 3).join(' / ')

      return this.media.label
    },
    metadata() {
      const entries = []

      if (Number.isFinite(this.item?.averageScore)) {
        entries.push(`${this.item.averageScore}%`)
      }

      const progress = `${this.item?.progressDisplay ?? ''}`.trim()
      if (progress) {
        entries.push(this.progressLabel(progress))
      } else if (this.item?.format && this.item.format !== this.media.type) {
        entries.push(this.item.format)
      }

      return entries.slice(0, 2)
    },
    accessibleLabel() {
      return [this.title, ...this.metadata].filter(Boolean).join(', ')
    },
  },
  methods: {
    progressLabel(progress) {
      return {
        ANIME: `Episodes ${progress}`,
        MANGA: `Chapters ${progress}`,
        MOVIE: `Release ${progress}`,
        TV: `Episodes ${progress}`,
        BOOK: `Published ${progress}`,
      }[this.media.type] ?? progress
    },
    setFallbackImage(event) {
      useFallbackImage(event, this.imageType, this.title)
    },
  },
}
</script>

<style scoped>
.home-media-card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  color: var(--clr-text);
  background: var(--clr-secondary-800-3);
  text-decoration: none;
}

.card-art {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
      linear-gradient(120deg, var(--clr-secondary-800), var(--clr-bg));
}

.card-art::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
      linear-gradient(to top, hsl(var(--clr-black) / .94) 0%, hsl(var(--clr-black) / .42) 58%, transparent 100%);
  pointer-events: none;
}

.card-art img {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  transition: transform 220ms ease, filter 220ms ease;
}

.card-content {
  position: absolute;
  z-index: 1;
  inset: auto 0 0;
  display: grid;
  gap: .28rem;
  padding: .65rem;
  background: linear-gradient(to top, hsl(var(--clr-black) / .88), transparent);
}

h3 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: var(--txt-small);
  line-height: 1.2;
  text-shadow: 0 1px 3px hsl(var(--clr-black) / .9);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: .3rem;
  min-width: 0;
}

.card-meta span {
  overflow: hidden;
  max-width: 100%;
  padding: .12rem .35rem;
  border: 1px solid var(--clr-primary-400-5);
  border-radius: var(--radius-xs);
  background: hsl(var(--clr-black) / .68);
  color: var(--clr-primary-200);
  font-size: var(--txt-xsm);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: var(--txt-xsm);
  line-height: 1.35;
}

.is-compact {
  display: grid;
  grid-template-columns: clamp(4.25rem, 20%, 4.5rem) minmax(0, 1fr);
  min-height: 6.5rem;
}

.is-compact .card-art {
  position: relative;
  grid-column: 1;
}

.is-compact .card-art::after {
  background: linear-gradient(to right, transparent 65%, hsl(var(--clr-black) / .32));
}

.is-compact .card-art img {
  object-fit: cover;
}

.is-compact .card-content {
  position: relative;
  grid-column: 2;
  inset: auto;
  align-content: center;
  background: var(--clr-secondary-800-3);
}

.is-compact .card-meta {
  flex-wrap: nowrap;
}

.is-compact .card-summary {
  -webkit-line-clamp: 1;
}

.uses-poster-art:not(.is-compact) .card-art {
  padding-right: 62%;
}

.uses-poster-art:not(.is-compact) .card-art::after {
  background:
      linear-gradient(to right, transparent 0 25%, hsl(var(--clr-black) / .9) 43%, hsl(var(--clr-black) / .72) 100%);
}

.uses-poster-art:not(.is-compact) .card-art img {
  object-fit: contain;
}

.uses-poster-art:not(.is-compact) .card-content {
  inset: 0 0 0 35%;
  align-content: end;
}

.home-media-card:focus-visible {
  outline: 2px solid var(--clr-primary-200);
  outline-offset: -2px;
}

@media (hover: hover) and (pointer: fine) {
  .is-strip .card-summary,
  .is-gallery .card-summary {
    max-height: 0;
    opacity: 0;
    transform: translateY(.35rem);
    transition: max-height 220ms ease, opacity 160ms ease, transform 220ms ease;
  }

  .is-strip:hover .card-summary,
  .is-strip:focus-visible .card-summary,
  .is-gallery:hover .card-summary,
  .is-gallery:focus-visible .card-summary {
    max-height: 3rem;
    opacity: 1;
    transform: translateY(0);
  }

  .is-strip:hover .card-art img,
  .is-strip:focus-visible .card-art img,
  .is-gallery:hover .card-art img,
  .is-gallery:focus-visible .card-art img {
    filter: brightness(.58);
    transform: scale(1.045);
  }
}

@media (max-width: 58rem) {
  .is-strip,
  .is-gallery {
    min-height: 11rem;
    scroll-snap-align: start;
  }

  .is-strip .card-summary,
  .is-gallery .card-summary {
    -webkit-line-clamp: 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-art img,
  .card-summary {
    transition: none;
  }
}
</style>

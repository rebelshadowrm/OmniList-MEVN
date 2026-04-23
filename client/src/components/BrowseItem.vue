<template>
<div class="browse-item">
  <router-link class="title-link" :to="detailPath" :title="title">
    <h2>{{title}}</h2>
  </router-link>
  <router-link class="img-link" :to="detailPath">
    <img :src="imageSrc(img, 'poster', title)"
         :alt="title"
         loading="lazy"
         @error="setFallbackImage($event, 'poster', title)">
  </router-link>
    <div class="sub">
      <div v-html="description"></div>
    </div>
    <div class="ribbon">
      <div class="info">
        <p class="score" :class="scoreClass">Score: <span>{{scoreLabel}}</span></p>
        <p>{{progressLabel}}: {{progressTotalLabel}}</p>
      </div>
      <div class="genres">
        <button v-for="genre in genres"
                :key="genre"
                :class="['genre-chip', genreClass(genre), genreState(genre)]"
                type="button"
                @click="handleGenreClick(genre)"
                @dblclick="handleGenreDoubleClick(genre)">{{genre}}</button>
      </div>
    </div>

</div>
</template>

<script>
import {imageOrFallback, useFallbackImage} from "../utils/fallbackImages";

export default {
  name: "BrowseItem",
  emits: ['genre-clicked', 'genre-isolated'],
  props: {
    id: Number,
    title: String,
    description: String,
    img: String,
    score: Number,
    episodes: Number,
    progressValue: [Number, String],
    progressLabel: {
      type: String,
      default: 'Episodes',
    },
    mediaPath: {
      type: String,
      default: 'anime',
    },
    genres: Array,
    selectedGenres: {
      type: Array,
      default: () => [],
    },
    excludedGenres: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      genreClickTimer: null,
    }
  },
  computed: {
    detailPath() {
      return `/${this.mediaPath}/${this.id}`
    },
    scoreLabel() {
      return Number.isFinite(this.score) ? this.score : 'N/A'
    },
    progressTotalLabel() {
      const value = this.progressValue ?? this.episodes

      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }

      return Number.isFinite(value) && value > 0 ? value : 'N/A'
    },
    scoreClass() {
      if (!Number.isFinite(this.score)) {
        return 'score-unknown'
      }

      if (this.score >= 85) {
        return 'score-great'
      }

      if (this.score >= 75) {
        return 'score-good'
      }

      if (this.score >= 60) {
        return 'score-neutral'
      }

      if (this.score >= 45) {
        return 'score-worse'
      }

      return 'score-bad'
    },
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    genreClass(genre) {
      return `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    },
    genreState(genre) {
      if (this.selectedGenres.includes(genre)) {
        return 'included'
      }

      if (this.excludedGenres.includes(genre)) {
        return 'excluded'
      }

      return ''
    },
    handleGenreClick(genre) {
      clearTimeout(this.genreClickTimer)

      this.genreClickTimer = setTimeout(() => {
        this.$emit('genre-clicked', genre)
        this.genreClickTimer = null
      }, 220)
    },
    handleGenreDoubleClick(genre) {
      clearTimeout(this.genreClickTimer)
      this.genreClickTimer = null
      this.$emit('genre-isolated', genre)
    },
  },
  beforeUnmount() {
    clearTimeout(this.genreClickTimer)
  },
}
</script>

<style scoped>
.browse-item {
  /*--rowHeight: 13rem;*/
  flex: 0 0 60ch;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  display: grid;
  grid-template-areas:
      'title title'
      'img info'
      'img .';
  grid-template-columns: 3fr 5fr;
  grid-template-rows: max-content 3fr 1fr;
  max-height: min-content;
  gap: .5rem 1rem;
  padding: .15rem;
  background-color: var(--clr-secondary-800-5);
  border-radius: var(--radius);
  font-size: var(--txt-xsm);
  max-width: 100%;
  position: relative;
  max-height: 20rem;
}
.title-link,
.img-link {
  grid-area: img;
  color: var(--clr-text);
  text-decoration: none;
}
.title-link {
  grid-area: title;
  min-width: 0;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background-color: var(--clr-secondary-800-3);
}
img {
  height: 100%;
  max-height: var(--rowHeight);
  aspect-ratio: 1 / 1.5;
  object-fit: cover;
  border-radius: var(--radius-sm);
  margin-left: .25rem;
}
h2 {
  font-size: var(--txt-med);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: .25rem .5rem 0 .5rem;
}
.sub {
  grid-area: info;
  max-height: var(--rowHeight);
  overflow-y: auto;
  scrollbar-color: transparent transparent;
}
.sub:hover,
.sub:focus-within {
  scrollbar-color: var(--clr-secondary-400) var(--clr-primary-800-3);
}

.sub::-webkit-scrollbar {
  width: .3rem;
}
.sub::-webkit-scrollbar-corner,
.sub::-webkit-scrollbar-track {
  border-radius: 1vmin;
  background-color: transparent;
}
.sub::-webkit-scrollbar-thumb {
  border-radius: 1vmin;
  background-color: transparent;
}
.sub:hover::-webkit-scrollbar-corner,
.sub:hover::-webkit-scrollbar-track {
  background-color: var(--clr-primary-800-3);
}
.sub:hover::-webkit-scrollbar-thumb {
  background-color: var(--clr-secondary-400);
}
.sub:focus-within::-webkit-scrollbar-corner,
.sub:focus-within::-webkit-scrollbar-track {
  background-color: var(--clr-primary-800-3);
}
.sub:focus-within::-webkit-scrollbar-thumb {
  background-color: var(--clr-secondary-400);
}


.ribbon {
  grid-column: 1 / span 2;
  grid-row: 3/4;
  background: var(--clr-ribbon-bg);
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .4rem .6rem;
  justify-content: space-between;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}
.sub div {
  padding-right: .5rem;
}
.info {
  font-size: var(--txt-small);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.score {
  --score-h: var(--score-neutral-h);
  display: inline-flex;
  align-items: baseline;
  gap: .2rem;
  border: 1px solid hsl(var(--score-h) var(--score-status-s) var(--score-status-text-l) / var(--opacity-5));
  border-radius: var(--radius-xs);
  padding: .05rem .35rem;
  background-color: hsl(var(--score-h) var(--score-status-s) var(--score-status-bg-l) / var(--opacity-3));
  color: hsl(var(--score-h) var(--score-status-s) var(--score-status-text-l));
  font-weight: 600;
}
.score span {
  color: var(--clr-text);
}
.score-great {
  --score-h: var(--score-great-h);
}
.score-good {
  --score-h: var(--score-good-h);
}
.score-neutral,
.score-unknown {
  --score-h: var(--score-neutral-h);
}
.score-worse {
  --score-h: var(--score-worse-h);
}
.score-bad {
  --score-h: var(--score-bad-h);
}
.genres {
  display: flex;
  flex-direction: row;
  gap: .4rem;
  overflow-x: auto;
  scrollbar-color: transparent transparent;
}
.genres:hover,
.genres:focus-within {
  scrollbar-color: var(--clr-secondary-400) var(--clr-primary-800-3);
}
.genres::-webkit-scrollbar {
  height: .3rem;
}
.genres::-webkit-scrollbar-corner,
.genres::-webkit-scrollbar-track {
  border-radius: 1vmin;
  background-color: transparent;
}
.genres::-webkit-scrollbar-thumb {
  border-radius: 1vmin;
  background-color: transparent;
}
.genres:hover::-webkit-scrollbar-corner,
.genres:hover::-webkit-scrollbar-track {
  background-color: var(--clr-primary-800-3);
}
.genres:hover::-webkit-scrollbar-thumb {
  background-color: var(--clr-secondary-400);
}
.genres:focus-within::-webkit-scrollbar-corner,
.genres:focus-within::-webkit-scrollbar-track {
  background-color: var(--clr-primary-800-3);
}
.genres:focus-within::-webkit-scrollbar-thumb {
  background-color: var(--clr-secondary-400);
}

.genre-chip {
  --genre-h: var(--clr-secondary-h);
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  border: 1px solid hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-border-l) / var(--opacity-7));
  background-color: hsl(var(--genre-h) var(--filter-neutral-s) var(--filter-neutral-bg-l) / var(--opacity-3));
  color: var(--clr-text);
  border-radius: 50vw;
  padding: .15rem .35rem;
  cursor: pointer;
  white-space: nowrap;
}
.genre-chip.included {
  border-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-border-l));
  background-color: hsl(var(--genre-h) var(--filter-include-s) var(--filter-include-bg-l) / var(--opacity-7));
  color: hsl(var(--filter-include-text));
  font-weight: 600;
}
.genre-chip.excluded {
  border-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-border-l) / var(--opacity-7));
  border-style: dashed;
  background-color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-bg-l) / var(--opacity-5));
  color: hsl(var(--genre-h) var(--filter-exclude-s) var(--filter-exclude-text-l));
  font-weight: 600;
}
.genre-chip.included::before {
  content: '+';
}
.genre-chip.excluded::before {
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
@media only screen and (max-width: 40rem) {
  h2 {
    overflow: hidden;
    white-space: nowrap;
  }
  .genre-chip {
    max-height: 1.5rem;
  }
}
</style>

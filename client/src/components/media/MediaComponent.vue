<template>
  <div class="media-grid">
    <img class="hero-img"
         :src="imageSrc(data?.bannerImage, 'banner', mediaTitle)"
         :alt="mediaTitle"
         @error="setFallbackImage($event, 'banner', mediaTitle)">
    <div class="text">
      <h1 class="title">{{ data?.title?.english ?? data?.title?.romaji }}</h1>
      <div v-html="data?.description" class="description"></div>
    </div>
    <div class="card">
      <img class="card-img"
           :src="imageSrc(data?.coverImage?.large, 'poster', mediaTitle)"
           :alt="mediaTitle"
           @error="setFallbackImage($event, 'poster', mediaTitle)">
      <div class="btn-container">
        <template v-if="isLoggedIn">
        <div v-if="added" class="added">
          <select @change="updateStatus"
                  class="status"
                  name="status"
                  id="status"
                  :value="listItem?.status">
            <option :value="activeStatusValue">{{ activeStatusLabel }}</option>
            <option value="on-hold">On-Hold</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <optgroup label="">
              <option value="remove">REMOVE</option>
            </optgroup>
          </select>
          <div class="progress-container">
            <input @change="updateProgress"
                   @keydown.enter.prevent="$event.target.blur()"
                   class="progress"
                   min="0"
                   inputmode="numeric"
                   type="number"
                   :value="progressValue">&nbsp;/&nbsp;
            <span class="totalEps">{{ progressTotalLabel }}</span>
          </div>
        </div>
        <div v-else class="toAdd">
          <button @click.prevent="addToList">Add to List</button>
        </div>
        </template>
        <div v-else class="account-action">
          <router-link to="/login">Log in or create an account to add this to your list.</router-link>
        </div>
      </div>
      <div v-if="isLoggedIn"
           @click="toggleFavorite"
           :class="favorite ? 'favorite favorited' : 'favorite'">
        <i class="fas fa-heart"></i>
      </div>
    </div>
    <MediaPageNav @active="activeSection" class="nav"/>
    <div class="content">
      <MediaAside class="aside"
                  :infos="info"
      />
      <div class="main">
        <MediaCharacters v-if="section === 'overview' || section === 'characters'"
                         :section="section" :characters="data?.characters?.edges"/>
        <MediaStaff v-if="section === 'overview' || section === 'staff'"
                    :section="section" :staff="data?.staff?.edges"/>
        <MediaReviews v-if="section === 'overview' || section === 'reviews'"
                      :section="section"
                      :reviews="reviews"
                      :subject="mediaTitle"
                      :entity-ref="data?.entityRef"
                      :subject-id="subjectId"
                      :media-type="media.type"
                      :source="media.source"
                      :is-authenticated="isLoggedIn"/>
        <MediaDiscussions v-if="section === 'overview' || section === 'discussions'"
                          :section="section"
                          :discussions="discussions"
                          :subject="mediaTitle"
                          :entity-ref="data?.entityRef"
                          :subject-id="subjectId"
                          :media-type="media.type"
                          :source="media.source"
                          :is-authenticated="isLoggedIn"/>
      </div>
    </div>
  </div>
</template>

<script>
import MediaPageNav from "./MediaNav.vue";
import MediaAside from "./MediaAside.vue";
import MediaCharacters from "./MediaCharacters.vue";
import MediaReviews from "./MediaReviews.vue";
import MediaStaff from "./MediaStaff.vue"
import MediaDiscussions from "./MediaDiscussions.vue";
import useUser from "../../composables/user"
import MediaListService from "../../services/MediaListService";
import {mediaConfig} from "../../config/mediaTypes.js";
import {imageOrFallback, useFallbackImage} from "../../utils/fallbackImages";
import {buildLibraryEntryPayload} from "../../utils/libraryPayload";


export default {
  name: "MediaComponent",
  components: {
    MediaDiscussions,
    MediaReviews,
    MediaCharacters,
    MediaAside,
    MediaPageNav,
    MediaStaff
  },
  props: {
    data: Object,
    info: Array,
    added: Boolean,
    favorite: Boolean,
    discussions: Array,
    reviews: Array,
    listItem: Object
  },
  emits: [
    'update-favorite',
    'add-to-list',
    'set-added'
  ],
  data() {
    return {
      section: '',
    }
  },
  computed: {
    media() {
      return mediaConfig(this.data?.mediaType)
    },
    listMediaId() {
      return this.listItem?.entityRef?.externalId ?? this.listItem?.externalId ?? this.listItem?.mediaId ?? this.listItem?.animeId
    },
    subjectId() {
      return this.data?.entityRef?.externalId ?? this.data?.id
    },
    progressTotal() {
      const total = Number.parseInt(this.listItem?.progressTotal ?? this.listItem?.totalEpisodes ?? this.data?.progressTotal, 10)

      return Number.isNaN(total) || total < 1 ? null : total
    },
    progressTotalLabel() {
      return this.progressTotal ?? '-'
    },
    progressValue() {
      const progress = Number.parseInt(this.listItem?.progress, 10)

      return Number.isNaN(progress) || progress < 1 ? 0 : progress
    },
    activeStatusValue() {
      return this.media.activeStatus
    },
    activeStatusLabel() {
      return this.media.activeStatusLabel
    },
    isLoggedIn() {
      const {getIsLoggedIn} = useUser()

      return getIsLoggedIn().value
    },
    mediaTitle() {
      return this?.data?.title?.english ?? this?.data?.title?.romaji ?? this?.data?.title?.native
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    async updateProgress(e) {
      let progress = Number.parseInt(e.target.value, 10)
      if (Number.isNaN(progress) || progress < 0) {
        progress = 0
      }

      if (typeof this.progressTotal === 'number' && progress >= this.progressTotal) {
        progress = this.progressTotal
        try {
          const {getUser} = useUser()
          const {user} = getUser().value
          if (user?._id) {
            const data = {status: 'completed'}
            const res = await MediaListService.updateMediaListItem(user?._id, this.media.type, this.listMediaId, data)
            if (res?.status === 200) {
              this.listItem.status = 'completed'
            }
          }
        } catch (err) {
          console.log(err.message)
        }
      }

      const updated = await this.updateListProgress(this.listMediaId, progress)
      this.listItem.progress = updated ? progress : this.progressValue
      e.target.value = `${this.listItem.progress ?? 0}`
    },
    async updateListProgress(mediaId, progress) {
      const {getUser} = useUser()
      const {user} = getUser().value
      if (user?._id) {
        try {
          const data = {progress}
          const res = await MediaListService.updateMediaListItem(user?._id, this.media.type, mediaId, data)
          return res?.status === 200
        } catch (err) {
          console.log(err.message)
        }
      }

      return false
    },
    async updateStatus(e) {
      const mediaId = this.listMediaId
      const status = e.target.value
      const {getUser} = useUser()
      const {user} = getUser().value
      if (user?._id) {
        if (status === 'remove') {
          try {
            const listId = this.listItem?._id
            if (listId) {
              await MediaListService.deleteMediaListItem(listId)
              this.$emit('set-added', false)
            }
          } catch (err) {
            console.log(err.message)
          }
        } else {
          if (status === 'completed' && typeof this.progressTotal === 'number') {
            try {
              const data = {
                status,
                progress: this.progressTotal
              }
              const res = await MediaListService.updateMediaListItem(user?._id, this.media.type, mediaId, data)
              if (res?.status === 200) {
                this.listItem.status = status
                this.listItem.progress = this.progressTotal
              }
            } catch (err) {
              console.log(err.message)
            }
          } else {
            try {
              const data = {status}
              const res = await MediaListService.updateMediaListItem(user?._id, this.media.type, mediaId, data)
              if (res?.status === 200) {
                this.listItem.status = status
              }
            } catch (err) {
              console.log(err.message)
            }
          }
        }

      }
    },
    activeSection(section) {
      this.section = section
    },
    async toggleFavorite() {
      if (!this.isLoggedIn) {
        return
      }

      this.$emit('update-favorite', !this.favorite)
    },
    async addToList() {
      const {getUser} = useUser()
      const {user} = getUser().value
      if (!user?._id) {
        return
      }

      const data = buildLibraryEntryPayload({
        userId: user._id,
        mediaType: this.media.type,
        catalogItem: this.data,
      })
      this.$emit('add-to-list', data)
    }
  }
}
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 17.5vh) 175px max-content 1fr;
  background-color: var(--clr-secondary-800-5);
  column-gap: 2rem;
  row-gap: .3rem;
}

.nav {
  grid-column: 4 / span 9;
  grid-row: 4 / 5;
}

.hero-img {
  grid-column: 1 / span 12;
  grid-row: 1 / 3;
  width: 100%;
  height: 35vh;
  object-fit: cover;

}

.text {
  grid-column: 4 / span 8;
  grid-row: 3 / 4;
  max-height: 175px;
  overflow-y: auto;
}

.card {
  grid-column: 2 / span 2;
  grid-row: 2 / span 3;
  z-index: 1;
  width: 215px;
  display: grid;
  grid-template-areas:
      'img img'
      'btn fav';
  max-width: max-content;
  gap: 1rem;
}

.card-img {
  max-height: 300px;
  min-height: 300px;
  max-width: 215px;
  min-width: 215px;
  grid-area: img;
  border-radius: var(--radius-sm);
  filter: drop-shadow(0 0 .75rem hsl(var(--clr-black-800) / .3));
}

.btn-container {
  grid-area: btn;
  align-self: baseline;
}

.toAdd {
  display: flex;
  border-radius: var(--radius-sm);
  width: max-content;
}

.account-action {
  max-width: 14rem;
  padding: .5rem;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  background-color: var(--clr-secondary-800-5);
  font-size: var(--txt-small);
}

.account-action a {
  color: var(--clr-primary-400);
  text-decoration: none;
  font-weight: 600;
}

i {
  color: hsl(var(--clr-white-200));
}

.favorite {
  grid-area: fav;
  background-color: var(--clr-favorite);
  width: max-content;
  padding: .25rem .5rem;
  border-radius: var(--radius-sm);
  align-self: baseline;
  justify-self: end;
  cursor: pointer;
}

.favorited {
  background-color: transparent;
  cursor: default;
}

.favorited i {
  color: var(--clr-favorite);
  transform: scale(1.75);
}

button {
  padding: .25rem 1.5rem;
  width: 100%;
  background-color: var(--clr-btn-bg);
  color: var(--clr-btn);
  font-size: var(--txt-small);
  font-weight: 500;
  letter-spacing: 1px;
  border-color: var(--clr-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.added {
  display: flex;
  flex-direction: column;
  gap: .3rem;
}

.progress-container {
  gap: .2rem;
  place-self: end;
  display: flex;
  align-items: baseline;
}

.progress {
  width: 4.5rem;
  padding: 0 .5rem;
  color: var(--clr-text);
  background: transparent;
  border: 1px solid var(--clr-border);
}

select {
  color: var(--clr-text);
  background: transparent;
  outline: none;
  font-size: var(--txt-small);
}

.status {
  padding: .25rem;
  border: 1px solid var(--clr-border);
}

optgroup,
option {
  background-color: var(--clr-bg);
}

.title {
  font-size: var(--txt-med);
  font-weight: 600;
}

.content {
  grid-column: 1/ span 12;
  grid-row: 5;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 2rem;
  row-gap: .3rem;
  background-color: var(--clr-bg);
  --top-margin: 2rem;
}

.content .aside {
  margin-top: var(--top-margin);
  grid-column: 2 / span 2;
  display: flex;
  flex-direction: column;
  width: 215px;
  background-color: var(--clr-secondary-800-5);
  border-radius: var(--radius-xs);
  padding-bottom: 1rem;
}

.content .main {
  margin-top: var(--top-margin);
  grid-column: 4 / span 8;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media only screen and (max-width: 48.375rem) {
  .media-grid {
    grid-template-rows: 17.5vh repeat(3, max-content) 1fr;
    row-gap: .5rem;
  }

  .favorite {
    place-self: end;
  }

  .text {
    grid-column: 2 / span 10;
    grid-row: 3/4;
  }

  .description {
    display: none;
  }

  .content .aside {
    grid-column: 1 / span 12;
    grid-row: 1/2;
    flex-direction: row;
    width: auto;
    overflow-x: auto;
    max-width: calc(100% - 2rem);
    place-self: center;
  }

  .content .main {
    grid-row-start: 2;
    grid-column: 2 / span 10;
  }

  .hero-img {
    height: 33vh;
  }

  .card {
    grid-row: 2/3;
    grid-column: 2 / span 10;
    grid-template-columns: max-content 1fr max-content;
    grid-template-areas:
      'img btn fav';
    width: auto;
    max-width: 100%;
  }

  .btn-container {
    max-width: 100%;
    align-self: end;
  }

  .card-img {
    min-height: unset;
    height: 175px;
    max-height: 100%;
    min-width: unset;
    max-width: 100%;
  }

  .nav {
    grid-column: 1 / span 12;
    grid-row: 4/5;
    max-width: calc(100% - 2rem);
    place-self: center;
  }
}
</style>

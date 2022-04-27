<template>
  <div class="media-grid">
    <img v-if="data?.bannerImage" class="hero-img" :src="data?.bannerImage" alt="">
    <div class="text">
      <h1 class="title">{{ data?.title?.english ?? data?.title?.romaji }}</h1>
      <div v-html="data?.description" class="description"></div>
    </div>
    <div class="card">
      <img class="card-img" :src="data?.coverImage?.large" alt="">
      <div class="btn-container">
        <div v-if="added" class="added">
          <select @change="updateStatus"
                  :data-id="listItem?.animeId"
                  :data-delete="listItem?._id"
                  class="status"
                  name="status"
                  id="status"
                  :value="listItem?.status">
            <option value="watching">Watching</option>
            <option value="on-hold">On-Hold</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <optgroup label="">
              <option value="remove">REMOVE</option>
            </optgroup>
          </select>
          <div class="progress-container">
            <span @keydown.enter.prevent="blur"
                  @blur="updateProgress"
                  :data-id="listItem?.animeId"
                  class="progress"
                  role="textbox"
                  contenteditable="true"
            >{{ listItem?.progress < 1 ? 0 : listItem?.progress }}</span>&nbsp;/&nbsp;
            <span class="totalEps">{{ listItem?.totalEpisodes < 1 ? '—' : listItem?.totalEpisodes }}</span>
          </div>
        </div>
        <div v-else class="toAdd">
          <button @click.prevent="addToList">Add to List</button>
        </div>
      </div>
      <div @click="favoriteAnime"
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
                      :section="section" :reviews="reviews"/>
        <MediaDiscussions v-if="section === 'overview' || section === 'discussions'"
                          :section="section" :discussions="discussions"/>
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
import AnimeService from "../../services/AnimeService";


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
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    blur(e) {
      e.target.blur()
    },
    async updateProgress(e) {
      let progressInt = parseInt(e.target.textContent)
      const animeId = e.target.dataset.id
      if (!progressInt || progressInt < 0) {
        e.target.textContent = 0
      }
      const totalEps = e.target.parentNode.querySelector('.totalEps').textContent
      const totalEpsInt = parseInt(totalEps)
      if (progressInt > totalEpsInt || progressInt === totalEpsInt) {
        progressInt = totalEpsInt
        try {
          const {getUser} = useUser()
          const {user} = getUser().value
          if(user?._id) {
            const data = { status: 'completed' }
            const res = await AnimeService.updateAnimeListItem(user?._id, animeId, data)
            if(res.status === 200) {
              const statusElem = document.querySelector('.status')
              statusElem.value = 'completed'
            }
          }
        } catch (err) {
          console.log(err.message)
        }
      }
      if (progressInt) {
        await this.updateListProgress(animeId, progressInt)
        e.target.textContent = progressInt.toString()
      }
    },
    async updateListProgress(animeId, progress) {
      const {getUser} = useUser()
      const {user} = getUser().value
      if (user?._id) {
        try {
          const data = {progress}
          await AnimeService.updateAnimeListItem(user?._id, animeId, data)
        } catch (err) {
          console.log(err.message)
        }
      }
    },
    async updateStatus(e) {
      const animeId = e.target.dataset.id
      const status = e.target.value
      const {getUser} = useUser()
      const {user} = getUser().value
      if (user?._id) {
        if (status === 'remove') {
          try {
            const listId = e?.target?.dataset?.delete
            if (listId) {
              await AnimeService.deleteAnimeListItem(listId)
              this.$emit('set-added', false)
            }
          } catch (err) {
            console.log(err.message)
          }
        } else {
          try {
            const data = { status }
            await AnimeService.updateAnimeListItem(user?._id, animeId, data)
          } catch (err) {
            console.log(err.message)
          }
        }

      }
    },
    activeSection(section) {
      this.section = section
    },
    async favoriteAnime() {
      this.$emit('update-favorite', !this.favorite)
    },
    async addToList() {
      const {getUser} = useUser()
      const {user} = getUser().value
      const data = {
        user: user._id,
        animeId: this?.data?.id,
        title: this?.data?.title?.english ?? this?.data?.title?.romaji ?? this?.data?.title?.native,
        status: 'watching',
        progress: 0,
        totalEpisodes: this?.data?.episodes ?? 0,
        rating: 0,
        image: this?.data?.coverImage?.large ?? 'https://via.placeholder.com/50',
        format: this?.data?.format,
        genre: this?.data?.genres

      }
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
  border-radius: 5px;
  filter: drop-shadow(0 0 .75rem hsl(var(--clr-black-800) / .3));
}

.btn-container {
  grid-area: btn;
  align-self: baseline;
}

.toAdd {
  display: flex;
  border-radius: 5px;
  width: max-content;
}

i {
  color: hsl(0deg 0% 95%);
}

.favorite {
  grid-area: fav;
  background-color: hsl(337, 100%, 40%);
  width: max-content;
  padding: .25rem .5rem;
  border-radius: 5px;
  align-self: baseline;
  justify-self: end;
  cursor: pointer;
}

.favorited {
  background-color: transparent;
  cursor: default;
}

.favorited i {
  color: hsl(337, 100%, 40%);
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
  border-color: hsl(0deg 0% 100% / .3);
  border-radius: 5px;
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
  padding: 0 .5rem;
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
  border-radius: 3px;
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
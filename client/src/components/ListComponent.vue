<template>
  <VTable :data="rows"
          sortIconPosition="before">
    <template #head>
      <tr>
        <th class="table-img-head"></th>
        <VTh class="table-title-head" sortKey="title" defaultSort="desc">Title</VTh>
        <VTh class="table-type-head" sortKey="mediaType">Type</VTh>
        <VTh class="table-rating-head" sortKey="rating">Rating</VTh>
        <VTh class="table-progress-head" sortKey="progress">Progress</VTh>
      </tr>
    </template>
    <template #body="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td class="table-img-row">
          <router-link :to="mediaDetailPath(row)">
            <img :src="imageSrc(row.image, 'poster', row.title)"
                 :alt="row.title"
                 @error="setFallbackImage($event, 'poster', row.title)">
          </router-link>
        </td>
        <td class="table-title-row">
          <router-link :to="mediaDetailPath(row)">{{ row.title }}</router-link>
        </td>
        <td class="table-type-row">
          {{ mediaLabel(row) }}
        </td>
        <td class="table-rating-row">
          <select @change="updateRating"
                  :disabled="loggedInUser?.user?._id !== user?._id"
                  :data-id="mediaId(row)"
                  :data-type="mediaType(row)"
                  id="rating"
                  name="rating"
                  class="rating-dropdown"
                  :value="row.rating < 1 ? 0 : row.rating">
            <option value="0">—</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </td>
        <td class="table-progress-row">
          <span @blur="progressChange"
                @keydown.enter.prevent="blur"
                :data-id="mediaId(row)"
                :data-type="mediaType(row)"
                role="textbox"
                :contenteditable="loggedInUser?.user?._id === user?._id"
                class="media-progress">
            {{ row.progress < 1 ? 0 : row.progress }}
          </span>
          <span class="slash">&nbsp;/&nbsp;</span>
          <span class="totalEps">{{ progressTotal(row) < 1 ? '—' : progressTotal(row) ?? '—' }}</span>
          <i v-if="loggedInUser?.user?._id === user?._id" @click="increase" class="fas fa-plus addIcon"></i>
        </td>
      </tr>
    </template>
  </VTable>
</template>

<script>
import useUser from "../composables/user"
import MediaListService from "../services/MediaListService";
import UserService from "../services/UserService";
import {mediaConfig} from "../config/mediaTypes.js";
import {imageOrFallback, useFallbackImage} from "../utils/fallbackImages";

export default {
  name: "ListComponent",
  props: {
    mediaList: Array,
    animeList: Array,
  },
  computed: {
    rows() {
      return this.mediaList ?? this.animeList ?? []
    },
  },
  data: () => ({
    user: {},
    loggedInUser: {}
  }),
  async created() {
    try {
      const {getUser} = useUser()
      this.loggedInUser = getUser()
      const username = this?.$route?.params?.username
      const res = await UserService.getUserByUsername(username)
      if (res.status === 200) {
        this.user = res.data
      }

    } catch (err) {
      console.log(err.message)
    }
  },
  methods: {
    imageSrc(src, type, label) {
      return imageOrFallback(src, type, label)
    },
    setFallbackImage(event, type, label) {
      useFallbackImage(event, type, label)
    },
    blur(e) {
      e.target.blur()
    },
    async updateRating(e) {
      const mediaId = e.target.dataset.id
      const mediaType = e.target.dataset.type
      const rating = e.target.value
      if (this?.user?._id) {
        try {
          const data = {rating}
          await MediaListService.updateMediaListItem(this?.user?._id, mediaType, mediaId, data)
        } catch (err) {
          console.log(err.message)
        }
      }
    },
    async increase(e) {
      const progress = e.target.parentNode.querySelector('.media-progress')
      const mediaId = progress.dataset.id
      const mediaType = progress.dataset.type
      const totalEps = e.target.parentNode.querySelector('.totalEps')
      let progressNum = parseInt(progress.textContent)
      const totalEpsNum = parseInt(totalEps.textContent)
      if (progressNum < totalEpsNum) {
        progressNum++
        await this.updateListProgress(mediaId, mediaType, progressNum)
        progress.textContent = progressNum.toString()
      } else if (totalEps.textContent === '—') {
        progressNum++
        await this.updateListProgress(mediaId, mediaType, progressNum)
        progress.textContent = progressNum.toString()
      }
    },
    async progressChange(e) {
      let progressInt = parseInt(e.target.textContent)
      const mediaId = e.target.dataset.id
      const mediaType = e.target.dataset.type
      if (!progressInt || progressInt < 0) {
        e.target.textContent = 0
      }
      const totalEps = e.target.parentNode.querySelector('.totalEps').textContent
      const totalEpsInt = parseInt(totalEps)
      if (progressInt > totalEpsInt) {
        progressInt = totalEpsInt
      }
      if (progressInt) {
        await this.updateListProgress(mediaId, mediaType, progressInt)
        e.target.textContent = progressInt.toString()
      }

    },
    async updateListProgress(mediaId, mediaType, progress) {
      if (this?.user?._id) {
        try {
          const data = {progress}
          await MediaListService.updateMediaListItem(this?.user?._id, mediaType, mediaId, data)
        } catch (err) {
          console.log(err.message)
        }
      }
    },
    mediaType(row) {
      return row?.mediaType ?? 'ANIME'
    },
    mediaId(row) {
      return row?.mediaId ?? row?.animeId
    },
    mediaDetailPath(row) {
      const config = mediaConfig(this.mediaType(row))

      return `/${config.path}/${this.mediaId(row)}`
    },
    mediaLabel(row) {
      return mediaConfig(this.mediaType(row)).label
    },
    progressTotal(row) {
      return row?.progressTotal ?? row?.totalEpisodes
    }
  }
}
</script>

<style scoped>
.addIcon {
  cursor: pointer;
  padding: 0 .5rem;
}

.slash,
.totalEps {
  user-select: none;
}

.rating-dropdown {
  color: var(--clr-text);
  appearance: none;
  padding: .1rem .6rem .1rem 1.35rem;
  background-color: transparent;
  border-color: var(--border);
  outline: none;
}

.table-type-head,
.table-type-row {
  width: 1%;
  white-space: nowrap;
  text-align: center;
}

select[disabled] {
  border: none;
}

select,
option {
  font-size: var(--txt-med);
}

option {
  text-align: center;
  background-color: var(--clr-bg);
}

.media-progress {
  padding: .2rem .5rem;
}

a {
  text-decoration: none;
  color: var(--clr-text);
  font-size: var(--txt-small);
}
</style>

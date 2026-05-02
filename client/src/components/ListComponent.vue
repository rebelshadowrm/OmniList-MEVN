<template>
  <OmniTable :data="rows"
          sortIconPosition="before">
    <template #head>
      <tr>
        <th class="table-img-head"></th>
        <OmniTh class="table-title-head" sortKey="title" defaultSort="desc">Title</OmniTh>
        <OmniTh class="table-type-head" sortKey="mediaType">Type</OmniTh>
        <OmniTh class="table-rating-head" sortKey="rating">Rating</OmniTh>
        <OmniTh class="table-progress-head" sortKey="progress">Progress</OmniTh>
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
          <select @change="updateRating(row, $event)"
                  :disabled="loggedInUser?.user?._id !== user?._id"
                  id="rating"
                  name="rating"
                  class="rating-dropdown"
                  :value="ratingValue(row)">
            <option value="0">-</option>
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
          <input @change="progressChange(row, $event)"
                 @keydown.enter.prevent="$event.target.blur()"
                 :disabled="loggedInUser?.user?._id !== user?._id"
                 class="media-progress"
                 min="0"
                 inputmode="numeric"
                 type="number"
                 :value="progressValue(row)">
          <span class="slash">&nbsp;/&nbsp;</span>
          <span class="totalEps">{{ progressTotal(row) ?? '-' }}</span>
          <i v-if="loggedInUser?.user?._id === user?._id" @click="increase(row)" class="fas fa-plus addIcon"></i>
        </td>
      </tr>
    </template>
  </OmniTable>
</template>

<script>
import useUser from "../composables/user"
import MediaListService from "../services/MediaListService";
import UserService from "../services/UserService";
import {mediaConfig} from "../config/mediaTypes.js";
import {imageOrFallback, useFallbackImage} from "../utils/fallbackImages";
import OmniTable from "./table/OmniTable.vue";
import OmniTh from "./table/OmniTh.vue";

export default {
  name: "ListComponent",
  components: {
    OmniTable,
    OmniTh,
  },
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
    ratingValue(row) {
      const rating = Number.parseInt(row?.rating, 10)

      return Number.isNaN(rating) || rating < 1 ? 0 : rating
    },
    progressValue(row) {
      const progress = Number.parseInt(row?.progress, 10)

      return Number.isNaN(progress) || progress < 1 ? 0 : progress
    },
    async updateRating(row, e) {
      const mediaId = this.mediaId(row)
      const mediaType = this.mediaType(row)
      const rating = Number.parseInt(e.target.value, 10) || 0
      if (this?.user?._id) {
        try {
          const data = {rating}
          const res = await MediaListService.updateMediaListItem(this?.user?._id, mediaType, mediaId, data)
          if (res?.status === 200) {
            row.rating = rating
          }
        } catch (err) {
          console.log(err.message)
        }
      }
    },
    async increase(row) {
      const nextProgress = this.progressValue(row) + 1
      const total = this.progressTotal(row)
      if (typeof total === 'number' && nextProgress > total) return

      const updated = await this.updateListProgress(this.mediaId(row), this.mediaType(row), nextProgress)
      if (updated) {
        row.progress = nextProgress
      }
    },
    async progressChange(row, e) {
      let progress = Number.parseInt(e.target.value, 10)
      if (Number.isNaN(progress) || progress < 0) {
        progress = 0
      }

      const total = this.progressTotal(row)
      if (typeof total === 'number' && progress > total) {
        progress = total
      }

      const updated = await this.updateListProgress(this.mediaId(row), this.mediaType(row), progress)
      row.progress = updated ? progress : this.progressValue(row)
      e.target.value = `${row.progress ?? 0}`
    },
    async updateListProgress(mediaId, mediaType, progress) {
      if (this?.user?._id) {
        try {
          const data = {progress}
          const res = await MediaListService.updateMediaListItem(this?.user?._id, mediaType, mediaId, data)
          return res?.status === 200
        } catch (err) {
          console.log(err.message)
        }
      }

      return false
    },
    mediaType(row) {
      return row?.entityRef?.domain ?? row?.mediaType ?? 'ANIME'
    },
    mediaId(row) {
      return row?.entityRef?.externalId ?? row?.externalId ?? row?.sourceId ?? row?.mediaId ?? row?.animeId
    },
    mediaDetailPath(row) {
      const config = mediaConfig(this.mediaType(row))

      return `/${config.path}/${this.mediaId(row)}`
    },
    mediaLabel(row) {
      return mediaConfig(this.mediaType(row)).label
    },
    progressTotal(row) {
      const total = Number.parseInt(row?.progressTotal ?? row?.totalEpisodes, 10)

      return Number.isNaN(total) || total < 1 ? null : total
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
  width: 4.5rem;
  padding: .2rem .5rem;
  color: var(--clr-text);
  background: transparent;
  border: 1px solid var(--clr-border);
}

a {
  text-decoration: none;
  color: var(--clr-text);
  font-size: var(--txt-small);
}
</style>

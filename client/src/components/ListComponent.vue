<template>
  <VTable :data="animeList"
          sortIconPosition="before">
    <template #head>
      <tr>
        <th class="table-img-head"></th>
        <VTh class="table-title-head" sortKey="title" defaultSort="desc">Anime Title</VTh>
        <VTh class="table-rating-head" sortKey="rating">Rating</VTh>
        <VTh class="table-progress-head" sortKey="progress">Progress</VTh>
      </tr>
    </template>
    <template #body="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td class="table-img-row">
          <router-link :to="`/anime/${row.animeId}`">
            <img :src="row.image" :alt="row.title">
          </router-link>
        </td>
        <td class="table-title-row">
          <router-link :to="`/anime/${row.animeId}`">{{ row.title }}</router-link>
        </td>
        <td class="table-rating-row">
          <select @change="updateRating"
                  :disabled="loggedInUser?.user?._id !== user?._id"
                  :data-id="row.animeId"
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
                :data-id="row.animeId"
                role="textbox"
                :contenteditable="loggedInUser?.user?._id === user?._id"
                class="anime-progress">
            {{ row.progress < 1 ? 0 : row.progress }}
          </span>
          <span class="slash">&nbsp;/&nbsp;</span>
          <span class="totalEps">{{ row?.totalEpisodes < 1 ? '—' : row?.totalEpisodes ?? '—' }}</span>
          <i v-if="loggedInUser?.user?._id === user?._id" @click="increase" class="fas fa-plus addIcon"></i>
        </td>
      </tr>
    </template>
  </VTable>
</template>

<script>
import useUser from "../composables/user"
import AnimeService from "../services/AnimeService";
import UserService from "../services/UserService";

export default {
  name: "ListComponent",
  props: {
    animeList: Array,
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
    blur(e) {
      e.target.blur()
    },
    async updateRating(e) {
      const animeId = e.target.dataset.id
      const rating = e.target.value
      if (this?.user?._id) {
        try {
          const data = {rating}
          await AnimeService.updateAnimeListItem(this?.user?._id, animeId, data)
        } catch (err) {
          console.log(err.message)
        }
      }
    },
    async increase(e) {
      const progress = e.target.parentNode.querySelector('.anime-progress')
      const animeId = progress.dataset.id
      const totalEps = e.target.parentNode.querySelector('.totalEps')
      let progressNum = parseInt(progress.textContent)
      const totalEpsNum = parseInt(totalEps.textContent)
      if (progressNum < totalEpsNum) {
        progressNum++
        await this.updateListProgress(animeId, progressNum)
        progress.textContent = progressNum.toString()
      } else if (totalEps.textContent === '—') {
        progressNum++
        await this.updateListProgress(animeId, progressNum)
        progress.textContent = progressNum.toString()
      }
    },
    async progressChange(e) {
      let progressInt = parseInt(e.target.textContent)
      const animeId = e.target.dataset.id
      if (!progressInt || progressInt < 0) {
        e.target.textContent = 0
      }
      const totalEps = e.target.parentNode.querySelector('.totalEps').textContent
      const totalEpsInt = parseInt(totalEps)
      if (progressInt > totalEpsInt) {
        progressInt = totalEpsInt
      }
      if (progressInt) {
        await this.updateListProgress(animeId, progressInt)
        e.target.textContent = progressInt.toString()
      }

    },
    async updateListProgress(animeId, progress) {
      if (this?.user?._id) {
        try {
          const data = {progress}
          await AnimeService.updateAnimeListItem(this?.user?._id, animeId, data)
        } catch (err) {
          console.log(err.message)
        }
      }
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

.anime-progress {
  padding: .2rem .5rem;
}

a {
  text-decoration: none;
  color: var(--clr-text);
  font-size: var(--txt-small);
}
</style>
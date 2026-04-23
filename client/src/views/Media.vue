<template>
  <MediaComponent
      @update-favorite="updateFavorite"
      @add-to-list="addToList"
      @set-added="setAdded"
      :listItem="listItem"
      :discussions="discussionArr"
      :reviews="reviewArr"
      :favorite="favorite"
      :added="added"
      :data="data"
      :info="infoArr"
  />
</template>

<script>
import MediaComponent from "../components/media/MediaComponent.vue"
import MediaListService from "../services/MediaListService";
import useUser from "../composables/user"
import ThreadService from "../services/ThreadService";
import UserService from "../services/UserService";
import {mediaConfig} from "../config/mediaTypes.js";
export default {
  name: "Media",
  components: {
    MediaComponent
  },
  data() {
    return {
      data: {},
      infoArr: [],
      added: false,
      favorite: false,
      discussionArr: [],
      reviewArr: [],
      listItem: {},
      requestId: 0,
    }
  },
  props: {
    id: [Number, String],
    mediaType: {
      type: String,
      default: 'ANIME',
    },
  },
  computed: {
    media() {
      return mediaConfig(this.mediaType)
    },
  },
  async created() {
    await this.loadMedia()
  },
  watch: {
    async id() {
      await this.loadMedia()
    },
    async mediaType() {
      await this.loadMedia()
    },
  },
  methods: {
  async loadMedia() {
    if (this.media.source === 'TMDB') {
      await this.loadTmdbMedia()
      return
    }

    try {
      const requestId = this.requestId + 1
      this.requestId = requestId
      this.data = {}
      this.infoArr = []
      this.added = false
      this.favorite = false
      this.discussionArr = []
      this.reviewArr = []
      this.listItem = {}
      const id = Number(this.id)
      const url = 'https://graphql.anilist.co'
      const variables = {
        id,
        type: this.media.type,
      }
      const query = `
            query ($id: Int, $type: MediaType) {
              Media(type: $type, id: $id) {
                characters {
                  edges {
                    role
                    node {
                      id
                      name {
                        userPreferred
                      }
                      image {
                        medium
                      }
                    }
                  }
                }
                staff {
                  edges {
                    role
                    node {
                      id
                      name {
                        userPreferred
                      }
                      image {
                        medium
                      }
                    }
                  }
                }
                studios {
                  edges {
                    isMain
                    node {
                      id
                      name
                    }
                  }
                }
                title {
                  english
                  romaji
                  native
                }
                description
                bannerImage
                coverImage {
                  large
                }
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                id
                genres
                episodes
                chapters
                volumes
                status
                season
                format
                favourites
                popularity
                averageScore
                meanScore
                source
                countryOfOrigin
                isAdult
                hashtag
                duration
                nextAiringEpisode {
                  episode
                  airingAt
                }
                synonyms
                tags {
                  name
                  rank
                  isMediaSpoiler
                }
                externalLinks {
                  site
                  url
                }
              }
            }
      `
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables
        })
      }
      const res = await fetch(url, options)
      if(res.ok) {
        const {data} = await res.json()
        if (requestId !== this.requestId) {
          return
        }
        this.dataSetup(data.Media)
        await this.addedCheck(data.Media.id, requestId)
        await this.populateReviews(data.Media.id, requestId)
        await this.populateDiscussions(data.Media.id, requestId)
        await this.setFavorite(data.Media.id, requestId)

      }
    } catch (err) {
      console.log(err.message)
    }
  },
    async loadTmdbMedia() {
      try {
        const requestId = this.requestId + 1
        this.requestId = requestId
        this.data = {}
        this.infoArr = []
        this.added = false
        this.favorite = false
        this.discussionArr = []
        this.reviewArr = []
        this.listItem = {}

        const mediaId = Number(this.id)
        const res = await fetch(`/api/tmdb/${this.media.path}/${mediaId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message ?? res.statusText)
        }

        if (requestId !== this.requestId) {
          return
        }

        this.dataSetup(data)
        await this.addedCheck(data.id, requestId)
        await this.populateReviews(data.id, requestId)
        await this.populateDiscussions(data.id, requestId)
        await this.setFavorite(data.id, requestId)
      } catch (err) {
        console.log(err.message)
      }
    },
    async setFavorite(mediaId, requestId = this.requestId) {
      const {getUser} = useUser()
      const {user} = getUser().value
      const mediaFavorites = user?.userProfile?.favorites?.mediaFavorites
          ?.map(({media}) => media) ?? []
      const legacyFavorites = user?.userProfile?.favorites?.animeFavorites
          ?.map(({anime}) => anime) ?? []
      const filter = [...mediaFavorites, ...legacyFavorites]
          .filter( media => media?.id === mediaId && (media?.mediaType ?? 'ANIME') === this.media.type )
      if(filter?.length > 0 && requestId === this.requestId) {
        this.favorite = true
      }
    },
    async populateDiscussions(id, requestId = this.requestId) {
      try {
        const res = await ThreadService.getDiscussionsByMedia(this.media.type, id)
        if(res && requestId === this.requestId) {
          this.discussionArr = res
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async populateReviews(id, requestId = this.requestId) {
      try {
        const res = await ThreadService.getReviewsByMedia(this.media.type, id)
        if(res && requestId === this.requestId) {
          this.reviewArr = res
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    setAdded(val) {
      this.added = val
    },
    async updateFavorite(val) {
      try {
        const {getUser} = useUser()
        const {user} = getUser().value
        if(user?._id) {
          if(val === true) {
            const data = {
              addFavorite: this.data
            }
            await UserService.updateUser(user?._id, data)
            this.favorite = val
          } else if (val === false) {
            const data = {
              removeFavorite: this.data
            }
            await UserService.updateUser(user?._id, data)
            this.favorite = val
          }
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async addToList(data) {
      try {
        const res = await MediaListService.createMediaListItem(data)
        if(res.status === 201) {
          this.listItem = res.data
          this.added = true
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async addedCheck(id, requestId = this.requestId) {
      try {
          const {getUser} = useUser()
          const {user} = getUser().value
          if(user?._id) {
          const mediaId = Number(id)
          const listItem = await MediaListService.getUserMediaListItem(user?._id, this.media.type, mediaId)
          if(listItem && requestId === this.requestId && (listItem.mediaId === mediaId || listItem.animeId === mediaId)) {
            this.added = true
            this.listItem = listItem
          }
        }
      } catch(err) {
        console.log(err.message)
      }

    },
    formatAiringDate(airingAt) {
      if (!airingAt) {
        return null
      }

      return new Date(airingAt * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    aniListProgressDisplay(data) {
      if (this.media.type !== 'ANIME' || !data?.nextAiringEpisode?.episode) {
        return null
      }

      const episode = data.nextAiringEpisode.episode
      const total = data.episodes && data.episodes >= episode ? `/${data.episodes}` : ''
      const airDate = this.formatAiringDate(data.nextAiringEpisode.airingAt)
      const airDateLabel = airDate ? ` airing ${airDate}` : ''

      return `${episode}${total}${airDateLabel}`
    },
    infoEntry(title, values) {
      const cleanValues = (Array.isArray(values) ? values : [values])
          .filter(value => value !== undefined && value !== null && value !== '')
          .map(value => ({ value }))

      return cleanValues.length ? { title, values: cleanValues } : null
    },
    nodeValues(edges = [], predicate = () => true) {
      return edges
          .filter(predicate)
          .map(edge => edge?.node?.name)
          .filter(Boolean)
    },
    topAniListTags(data) {
      return (data?.tags ?? [])
          .filter(tag => !tag.isMediaSpoiler)
          .sort((a, b) => b.rank - a.rank)
          .slice(0, 8)
          .map(tag => tag.name)
    },
    externalLinkValues(data) {
      return (data?.externalLinks ?? [])
          .slice(0, 6)
          .map(link => link?.site)
          .filter(Boolean)
    },
    providerFactEntries(data) {
      return (data?.mediaFacts ?? [])
          .map(({title, value}) => this.infoEntry(title, value))
          .filter(Boolean)
    },
    dataSetup(data) {
      const progressDisplay = data?.progressDisplay ?? this.aniListProgressDisplay(data)
      const sourceMaterial = this.media.source === 'ANILIST' ? data?.source : null
      this.data = {
        ...data,
        mediaType: this.media.type,
        source: this.media.source,
        sourceMaterial,
        progressLabel: this.media.progressLabel,
        progressUnit: this.media.progressUnit,
        progressTotal: data?.[this.media.totalField] ?? 0,
        progressDisplay,
      }

      let startDate = new Date(`${data.startDate?.month ?? '1'}/${data.startDate?.day ?? '11'}/${data.startDate?.year ?? '1111'}`)
      let endDate = new Date(`${data.endDate?.month ?? '1'}/${data.endDate?.day ?? '11'}/${data.endDate?.year ?? '1111'}`)

      if(endDate < new Date('1/12/1111')) {
        endDate = "---"
      } else {
        endDate = endDate.toLocaleDateString('en-US', {
          year:"numeric",
          month:"short",
          day:"numeric"
        })
      }

      if(startDate < new Date('1/12/1111')) {
        startDate = "---"
      } else {
        startDate = startDate.toLocaleDateString('en-US', {
          year:"numeric",
          month:"short",
          day:"numeric"
        })
      }

      const studios = this.nodeValues(data.studios?.edges, edge => edge?.isMain === true)
      const producers = this.nodeValues(data.studios?.edges, edge => edge?.isMain === false)
      const genres = data.genres ?? []
      const synonyms = data.synonyms ?? []
      const tags = this.topAniListTags(data)
      const externalLinks = this.externalLinkValues(data)
      const progressInfo = [
        this.infoEntry(this.media.progressLabel.toLowerCase(), progressDisplay ?? data?.[this.media.totalField] ?? '---'),
      ].filter(Boolean)

      if (this.media.type === 'MANGA') {
        progressInfo.push(this.infoEntry('volumes', data?.volumes ?? '---'))
      }

      const anilistAnimeInfo = this.media.type === 'ANIME'
          ? [
            this.infoEntry('duration', data?.duration ? `${data.duration}m` : '---'),
            this.infoEntry('season', data?.season ?? '---'),
            this.infoEntry('studios', studios),
            this.infoEntry('producers', producers),
            this.infoEntry('source material', sourceMaterial),
            this.infoEntry('country of origin', data?.countryOfOrigin),
            this.infoEntry('tags', tags),
            this.infoEntry('hashtag', data?.hashtag ?? '---'),
          ].filter(Boolean)
          : []
      const mangaInfo = this.media.type === 'MANGA'
          ? [
            this.infoEntry('source material', sourceMaterial),
            this.infoEntry('country of origin', data?.countryOfOrigin),
            this.infoEntry('tags', tags),
            this.infoEntry('external links', externalLinks),
          ].filter(Boolean)
          : []
      const movieInfo = this.media.type === 'MOVIE'
          ? [
            this.infoEntry('runtime', data?.runtime ? `${data.runtime}m` : '---'),
            this.infoEntry('studios', producers),
          ].filter(Boolean)
          : []
      const tvInfo = this.media.type === 'TV'
          ? [
            this.infoEntry('runtime', data?.runtime ? `${data.runtime}m` : '---'),
            this.infoEntry('seasons', data?.numberOfSeasons ?? '---'),
            this.infoEntry('networks', producers),
          ].filter(Boolean)
          : []

      this.infoArr = [
        this.infoEntry('format', data?.format ?? '---'),
        ...progressInfo,
        this.infoEntry('status', data?.status ?? '---'),
        this.infoEntry('start date', startDate),
        this.infoEntry('end date', endDate),
        this.infoEntry('average score', data?.averageScore ?? '---'),
        this.infoEntry('mean score', data?.meanScore ?? '---'),
        this.infoEntry('popularity', data?.popularity ?? '---'),
        this.infoEntry('favorites', data?.favourites ?? '---'),
        ...anilistAnimeInfo,
        ...mangaInfo,
        ...movieInfo,
        ...tvInfo,
        ...this.providerFactEntries(data),
        this.infoEntry('provider', this.media.source),
        this.infoEntry('genres', genres),
        this.infoEntry('romaji', data?.title?.romaji ?? '---'),
        this.infoEntry('english', data?.title?.english ?? '---'),
        this.infoEntry('native', data?.title?.native ?? '---'),
        this.infoEntry('synonyms', synonyms),
      ].filter(Boolean)
    }
  }

}
</script>

<style scoped>

</style>

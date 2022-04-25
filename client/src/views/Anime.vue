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
import AnimeService from "../services/AnimeService";
import useUser from "../composables/user"
import ThreadService from "../services/ThreadService";
export default {
  name: "Anime",
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
      listItem: {}
    }
  },
  props: {
    id: [Number, String],
  },
  async beforeCreate() {
    try {
      const id = this.id
      const url = 'https://graphql.anilist.co'
      const variables = { id }
      const query = `
            query ($id: Int) {
              Media(type: ANIME, id: $id) {
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
                status
                season
                format
                favourites
                popularity
                averageScore
                meanScore
                source
                hashtag
                duration
                synonyms
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
        this.dataSetup(data.Media)
        await this.addedCheck(data.Media.id)
        await this.populateReviews(data.Media.id)
        await this.populateDiscussions(data.Media.id)
      }
    } catch (err) {
      console.log(err.message)
    }
  },
  methods: {
    async populateDiscussions(id) {
      try {
        this.discussionArr = await ThreadService.getDiscussionsByAnime(id)
      } catch(err) {
        console.log(err.message)
      }
    },
    async populateReviews(id) {
      try {
        this.reviewArr = await ThreadService.getReviewsByAnime(id)
      } catch(err) {
        console.log(err.message)
      }
    },
    setAdded(val) {
      this.added = val
    },
    updateFavorite(val) {
      //TODO: Check favorite
      console.log(val)
      this.favorite = val
    },
    async addToList(data) {
      try {
        console.log(data)
        const res = await AnimeService.createAnimeListItem(data)
        if(res.status === 201) {
          this.listItem = res.data
          this.added = true
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async addedCheck(id) {
      try {
        const {getUser} = useUser()
        const {user} = getUser().value
        const listItem = await AnimeService.getUserAnimeListItem(user?._id, id)
        if(listItem && listItem.animeId === id) {
          this.added = true
          this.listItem = listItem
        }
      } catch(err) {
        console.log(err.message)
      }

    },
    dataSetup(data) {
      this.data = data

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

      const studiosArray = []
      data.studios?.edges?.forEach( e => {
        if(e?.isMain === true) {
          const elem = { value: e.node.name }
          studiosArray.push(elem)
        }
      })

      const producersArray = []
      data.studios?.edges?.forEach( e => {
        if(e?.isMain === false) {
          const elem = { value: e.node.name }
          producersArray.push(elem)
        }
      })

      const genreArray = []
      data.genres?.forEach( e => {
        const elem = { value: e }
        genreArray.push(elem)
      })

      const synonymsArray = []
      data.synonyms?.forEach( e => {
        const elem = { value: e }
        synonymsArray.push(elem)
      })
      this.infoArr = [
        {
          title: 'format',
          values: [
            {
              value: data?.format ?? '---'
            }
          ]
        },
        {
          title: 'episodes',
          values: [
            {
              value: data?.episodes ?? '---'
            }
          ]
        },
        {
          title: 'duration',
          values: [
            {
              value: `${data?.duration ?? '---'}m`
            }
          ]
        },
        {
          title: 'status',
          values: [
            {
              value: data?.status ?? '---'
            }
          ]
        },
        {
          title: 'start date',
          values: [
            {
              value: startDate
            }
          ]
        },
        {
          title: 'end date',
          values: [
            {
              value: endDate
            }
          ]
        },
        {
          title: 'season',
          values: [
            {
              value: data?.season ?? '---'
            }
          ]
        },
        {
          title: 'average score',
          values: [
            {
              value: data?.averageScore ?? '---'
            }
          ]
        },
        {
          title: 'mean score',
          values: [
            {
              value: data?.meanScore ?? '---'
            }
          ]
        },
        {
          title: 'popularity',
          values: [
            {
              value: data?.popularity ?? '---'
            }
          ]
        },
        {
          title: 'favorites',
          values: [
            {
              value: data?.favourites ?? '---'
            }
          ]
        },
        {
          title: 'studios',
          values: studiosArray
        },
        {
          title: 'producers',
          values: producersArray
        },
        {
          title: 'source',
          values: [
            {
              value: data?.source ?? '---'
            }
          ]
        },
        {
          title: 'hashtag',
          values: [
            {
              value: data?.hashtag ?? '---'
            }
          ]
        },
        {
          title: 'genres',
          values: genreArray
        },
        {
          title: 'romaji',
          values: [
            {
              value: data?.title?.romaji ?? '---'
            }
          ]
        },
        {
          title: 'english',
          values: [
            {
              value: data?.title?.english ?? '---'
            }
          ]
        },
        {
          title: 'native',
          values: [
            {
              value: data?.title?.native ?? '---'
            }
          ]
        },
        {
          title: 'synonyms',
          values: synonymsArray
        },
      ]
    }
  }

}
</script>

<style scoped>

</style>
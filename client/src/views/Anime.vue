<template>
  <MediaComponent :data="data" :info="infoArr"/>
</template>

<script>
import MediaComponent from "../components/media/MediaComponent.vue"
export default {
  name: "Anime",
  components: {
    MediaComponent
  },
  data() {
    return {
      data: {},
      infoArr: []
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
                    title {
                    english
                    romaji
                    }
                    description
                    bannerImage
                    coverImage {
                      large
                    }
                    characters {
                      nodes {
                          image {
                            medium
                          }
                          name {
                            full
                          }
                      }
                    }
                    genres
                    episodes
                    status
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
                    averageScore
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
        const media = data.Media
        this.data = media
        this.dataSetup(media)
        console.log(this.infoArr)
      }
    } catch (err) {
      console.log(err.message)
    }
  },
  methods: {
    dataSetup(data) {
      const startDate = new Date(`${data.startDate?.month}/${data.startDate?.day}/${data.startDate?.year}`)
          .toLocaleDateString('en-US', {
            year:"numeric",
            month:"short",
            day:"numeric"
          })
      const endDate = new Date(`${data.endDate?.month}/${data.endDate?.day}/${data.endDate?.year}`)
          .toLocaleDateString('en-US', {
            year:"numeric",
            month:"short",
            day:"numeric"
          })
      const studiosArray = []
      data.studios?.forEach( e => {
        const elem = { value: e }
        genreArray.push(elem)
      })
      const producersArray = []
      data.producers?.forEach( e => {
        const elem = { value: e }
        genreArray.push(elem)
      })
      const genreArray = []
      data.genres?.forEach( e => {
        const elem = { value: e }
        genreArray.push(elem)
      })
      const synonymsArray = []
      data.synonyms?.forEach( e => {
        const elem = { value: e }
        genreArray.push(elem)
      })
      this.infoArr = [
        {
          title: 'format',
          values: [
            {
              value: data.format
            }
          ]
        },
        {
          title: 'episodes',
          values: [
            {
              value: data.episodes
            }
          ]
        },
        {
          title: 'episode duration',
          values: [
            {
              value: data.episodeDuration
            }
          ]
        },
        {
          title: 'status',
          values: [
            {
              value: data.status
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
              value: data.season
            }
          ]
        },
        {
          title: 'average score',
          values: [
            {
              value: data.averageScore
            }
          ]
        },
        {
          title: 'mean score',
          values: [
            {
              value: data.meanScore
            }
          ]
        },
        {
          title: 'popularity',
          values: [
            {
              value: data.popularity
            }
          ]
        },
        {
          title: 'favorites',
          values: [
            {
              value: data.favorites
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
              value: data.source
            }
          ]
        },
        {
          title: 'hashtag',
          values: [
            {
              value: data.hashtag
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
              value: data.romaji
            }
          ]
        },
        {
          title: 'english',
          values: [
            {
              value: data.english
            }
          ]
        },
        {
          title: 'native',
          values: [
            {
              value: data.native
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
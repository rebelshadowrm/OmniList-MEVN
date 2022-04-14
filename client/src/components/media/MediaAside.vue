<template>
<div>
  <div v-for="info in infoArr" :key="info.id" class="aside-item">
    <p class="aside-title">{{info.title}}</p>
    <div class="aside-info">
      <p v-for="value in info.values" :key="value.id" >{{value.value}}</p>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: "MediaAside",
  props: {
    data: []
  },
  data() {
    return {
      infoArr: []
    }
  },
  created() {
    this.setInfo()
  },
  methods: {
    setInfo() {
      //TODO set from prop
      this.infoArr = [
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Genre',
          values: [
            {
              value: 'Comedy'
            },
            {
              value: 'Drama'
            },
            {
              value: 'Romance'
            },
            {
              value: 'Slice of life'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
        {
          title: 'Format',
          values: [
            {
              value: 'Anime'
            }
          ],
        },
      ]
    }
  }
}
</script>

<style scoped>
.aside-item {
  padding: 1rem 1rem 0 1rem;
  min-width: max-content;
}
.aside-title {
  font-weight: 500;
}
.aside-info p {
  font-weight: 300;
}
@media only screen and (max-width: 48.375rem) {
  .aside-info {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .aside-title {
    font-weight: 300;
  }
  .aside-info p {
    font-weight: 500;
  }

}

</style>
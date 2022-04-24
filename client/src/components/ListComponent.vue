<template>
  <VTable :data="animeList"
          sortIconPosition="before" >
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
        <td class="table-img-row"><img :src="row.img" :alt="row.title"></td>
        <td class="table-title-row">{{ row.title }}</td>
        <td class="table-rating-row">
          <select id="rating" name="rating" class="rating-dropdown" :value="row.rating" >
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
          <span @blur="progressChange" role="textbox" contenteditable="true" class="anime-progress">
            {{ row.progress }}
          </span>
          <span class="slash">&nbsp;/&nbsp;</span>
          <span class="totalEps">{{ row.totalEps}}</span>
          <i @click="increase" class="fas fa-plus addIcon"></i>
        </td>
      </tr>
    </template>
  </VTable>
</template>

<script>
export default {
  name: "ListComponent",
  data: () => ({
    animeList: []
  }),
  created() {
    this.animeList = [
      {
        img: 'https://via.placeholder.com/50',
        title: 'Naruto',
        rating: 8,
        progress: 135,
        totalEps: 300,
        status: 'watching'
      },
      {
        img: 'https://via.placeholder.com/50',
        title: 'Naruto',
        rating: 5,
        progress: 150,
        totalEps: 300,
        status: 'watching'
      },
      {
        img: 'https://via.placeholder.com/50',
        title: 'Naruto',
        rating: 7,
        progress: 200,
        totalEps: 300,
        status: 'watching'
      },
      {
        img: 'https://via.placeholder.com/50',
        title: 'Naruto',
        rating: 1,
        progress: 250,
        totalEps: 300,
        status: 'watching'
      },
    ]
  },
  methods: {
    increase(e) {
      const progress = e.target.parentNode.querySelector('.anime-progress')
      const totalEps = e.target.parentNode.querySelector('.totalEps')
      let progressNum = parseInt(progress.textContent)
      const totalEpsNum = parseInt(totalEps.textContent)
      if(progressNum < totalEpsNum) {
        progressNum++
        this.updateList()
        progress.textContent = progressNum.toString()
      }
    },
    progressChange(e) {
      const progressInt = parseInt(e.target.textContent)
      const totalEpsInt = parseInt(e.target.parentNode.querySelector('.totalEps').textContent)
      if(progressInt > totalEpsInt) {
        this.updateList()
        e.target.textContent = totalEpsInt
      }
    },
    async updateList(data) {
      //TODO: API call
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
option {
  text-align: center;
  background-color: var(--clr-bg);
}
</style>
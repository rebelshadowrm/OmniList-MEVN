<template>
  <h2>Flagged posts</h2>
  <div class="thread-reports">
    <VTable :data="reportedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
          <VTh class="table-post-head" sortKey="post">Post</VTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">{{ row?.user?.userName }}</td>
          <td class="table-post-row">{{ row?.body }}</td>
        </tr>
      </template>
    </VTable>
    <h2>Suspended Posts</h2>
    <VTable :data="suspendedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
          <VTh class="table-post-head" sortKey="post">Post</VTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">{{ row?.user?.userName }}</td>
          <td class="table-post-row">{{ row?.body }}</td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script>
import ThreadService from "../../services/ThreadService";

export default {
  name: "AdminThreadReports",
  data() {
    return {
      reportedData: [],
      suspendedData: []
    }
  },
  async created() {
    const discussions = await ThreadService.getDiscussions()
    const reviews = await ThreadService.getReviews()
    const threads = []
    discussions.forEach(e => {
      threads.push(e)
    })
    reviews.forEach(e => {
      threads.push(e)
    })
    this.suspendedData = threads.filter(({suspended}) => suspended === true)
    const flagged = threads.filter(({flagged}) => flagged === true)
    let reported = []
    flagged.forEach( e => {
      if(e.suspended === false) {
        reported.push(e)
      }
    })
    this.reportedData = reported
  }
}
</script>

<style scoped>
h2 {
  display: inline-block;
  margin-block: 1.25rem;
}
</style>
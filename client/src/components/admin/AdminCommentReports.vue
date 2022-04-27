<template>
  <h2>Flagged posts</h2>
  <div class="comment-reports">
    <VTable :data="reportedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
          <VTh class="table-comment-head" sortKey="post">Comment</VTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">
            <router-link :to="`/profile/${row?.user?.userName}`">
              {{ row?.user?.userName }}
            </router-link>
          </td>
          <td class="table-comment-row">{{ row?.comment }}</td>
        </tr>
      </template>
    </VTable>
    <h2>Suspended Posts</h2>
    <VTable :data="suspendedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
          <VTh class="table-comment-head" sortKey="post">Comment</VTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">
            <router-link :to="`/profile/${row?.user?.userName}`">
              {{ row?.user?.userName }}
            </router-link>
          </td>
          <td class="table-comment-row">{{ row?.comment }}</td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script>
import ThreadService from "../../services/ThreadService";

export default {
  name: "AdminCommentReports",
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
    if(discussions && reviews) {
      discussions?.forEach(e => {
        threads.push(e)
      })
      reviews?.forEach(e => {
        threads.push(e)
      })
      threads.push(reviews)
      const commentsArr = []
      threads.forEach( ({comments}) => {
        comments?.forEach(e => {
          commentsArr.push(e.comment)
        })
      })
      this.suspendedData = commentsArr.filter(({suspended}) => suspended === true)
      const flagged = commentsArr.filter(({flagged}) => flagged === true)
      let reported = []
      flagged.forEach( e => {
        if(e.suspended === false) {
          reported.push(e)
        }
      })
      this.reportedData = reported
    }
  }
}
</script>

<style scoped>
h2 {
  display: inline-block;
  margin-block: 1.25rem;
}
a {
  text-decoration: none;
  color: var(--clr-text);
}
</style>
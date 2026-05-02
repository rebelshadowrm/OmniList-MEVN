<template>
  <h2>Flagged posts</h2>
  <div class="thread-reports">
    <OmniTable :data="reportedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <OmniTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</OmniTh>
          <OmniTh class="table-post-head" sortKey="post">Post</OmniTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">
            <router-link :to="`/profile/${row?.user?.userName}`">
              {{ row?.user?.userName }}
            </router-link>
          </td>
          <td class="table-post-row">{{ row?.body }}</td>
        </tr>
      </template>
    </OmniTable>
    <h2>Suspended Posts</h2>
    <OmniTable :data="suspendedData"
            sortIconPosition="before">
      <template #head>
        <tr>
          <OmniTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</OmniTh>
          <OmniTh class="table-post-head" sortKey="post">Post</OmniTh>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.id">
          <td class="table-username-row">
            <router-link :to="`/profile/${row?.user?.userName}`">
              {{ row?.user?.userName }}
            </router-link>
          </td>
          <td class="table-post-row">{{ row?.body }}</td>
        </tr>
      </template>
    </OmniTable>
  </div>
</template>

<script>
import ThreadService from "../../services/ThreadService";
import OmniTable from "../table/OmniTable.vue";
import OmniTh from "../table/OmniTh.vue";

export default {
  name: "AdminThreadReports",
  components: {
    OmniTable,
    OmniTh,
  },
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

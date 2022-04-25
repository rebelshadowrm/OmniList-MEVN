<template>
  <section>
    <header>
      <span class="route-link" @click="section = 'user-list'">User List</span>
      <span class="route-link" @click="section = 'user-reports'">User Reports</span>
      <span class="route-link" @click="section = 'thread-reports'">Thread Reports</span>
      <span class="route-link" @click="section = 'comment-reports'">Comment Reports</span>
    </header>
    <div class="main">
      <AdminUserList v-if="section === 'user-list'"/>
      <AdminUserReports v-if="section === 'user-reports'"/>
      <AdminThreadReports v-if="section === 'thread-reports'"/>
      <AdminCommentReports v-if="section === 'comment-reports'"/>
    </div>
  </section>
</template>

<script>
import AdminUserList from "../components/admin/AdminUserList.vue";
import AdminUserReports from "../components/admin/AdminUserReports.vue";
import AdminThreadReports from "../components/admin/AdminThreadReports.vue";
import AdminCommentReports from "../components/admin/AdminCommentReports.vue";

export default {
  name: "AdminPanel",
  components: {
    AdminUserList,
    AdminUserReports,
    AdminThreadReports,
    AdminCommentReports
  },
  data() {
    return {
      section: 'user-list',
    }
  }
}
</script>

<style scoped>
header {
  margin-inline: auto;
  margin-block: 1rem;
  width: fit-content;
  display: flex;
  gap: 1rem;
}

.route-link {
  cursor: pointer;
}

.main {
  width: min(100% - 4rem, 60rem);
  margin-inline: auto;
}
</style>
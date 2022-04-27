<template>
  <section>
    <header>
      <span :class="section === 'user-list' ? 'route-link active' : 'route-link'"
            @click="section = 'user-list'">User List</span>
      <span :class="section === 'thread-reports' ? 'route-link active' : 'route-link'"
            @click="section = 'thread-reports'">Thread Reports</span>
      <span :class="section === 'comment-reports' ? 'route-link active' : 'route-link'"
            @click="section = 'comment-reports'">Comment Reports</span>
    </header>
    <div class="main">
      <AdminUserList v-if="section === 'user-list'"/>
      <AdminThreadReports v-if="section === 'thread-reports'"/>
      <AdminCommentReports v-if="section === 'comment-reports'"/>
    </div>
  </section>
</template>

<script>
import AdminUserList from "../components/admin/AdminUserList.vue";
import AdminThreadReports from "../components/admin/AdminThreadReports.vue";
import AdminCommentReports from "../components/admin/AdminCommentReports.vue";

export default {
  name: "AdminPanel",
  components: {
    AdminUserList,
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
  gap: 2rem;
}

.route-link {
  font-size: var(--txt-med);
  cursor: pointer;
}
.route-link.active {
  font-weight: 600;
  border-bottom: 1px solid var(--clr-text);
}

.main {
  width: min(100% - 4rem, 60rem);
  margin-inline: auto;
}
</style>
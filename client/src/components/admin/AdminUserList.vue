<template>
  <VTable :data="users"
          sortIconPosition="before" >
    <template #head>
      <tr>
        <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
        <VTh class="table-email-head" sortKey="email">Email</VTh>
        <VTh class="table-updated-head" :customSort="dateSort">Updated</VTh>
        <VTh class="table-role-head" sortKey="role">Role</VTh>
        <th></th>
      </tr>
    </template>
    <template #body="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td class="table-username-row">{{ row?.userName }}</td>
        <td class="table-email-row">{{ row?.email }}</td>
        <td class="table-updated-row">{{ row?.updatedAt.toLocaleDateString() }}</td>
        <td class="table-role-row">{{ row?.role }}</td>
        <td class="table-remove-row"><button>remove</button></td>
      </tr>
    </template>
  </VTable>
</template>

<script>
import UserService from "../../services/UserService";

export default {
  name: "AdminUserList",
  data() {
    return {
      users: []
    }
  },
  async created() {
    this.users = await UserService.getUsers()
  },
  methods: {
    dateSort(a, b, sortOrder) {
      let date1 = new Date(a.updatedAt);
      let date2 = new Date(b.updatedAt);

      if (sortOrder === 1) {
        return date1 - date2
      } else if (sortOrder === -1) {
        return date2 - date1
      } else {
        return 0
      }
    }
  }
}
</script>

<style scoped>
.user {
  display: grid;
  grid-auto-flow: column;
  gap: 2rem;
  place-items: start;
}
button {
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--clr-text);
  cursor: pointer;
  padding: .5rem 0;
}

</style>
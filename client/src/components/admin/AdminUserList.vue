<template>
  <VTable :data="users"
          sortIconPosition="before" >
    <template #head>
      <tr>
        <VTh class="table-username-head" sortKey="userName" defaultSort="desc">Username</VTh>
        <VTh class="table-email-head" sortKey="email">Email</VTh>
        <VTh class="table-updated-head" :customSort="dateSort">Updated</VTh>
        <VTh class="table-role-head" sortKey="role">Role</VTh>
        <VTh class="table-status-head" sortKey="status">Status</VTh>
      </tr>
    </template>
    <template #body="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td class="table-username-row">{{ row?.userName }}</td>
        <td class="table-email-row">{{ row?.email }}</td>
        <td class="table-updated-row">{{ row?.updatedAt.toLocaleDateString() }}</td>
        <td class="table-role-row">
          <select @change="updateRole"
                  :disabled="currentUser?.user?.role !== 'ADMIN'"
                  :data-id="row?._id"
                  :value="row?.role"
                  name="role"
                  id="role">
            <option value="USER">USER</option>
            <option value="MOD">MOD</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </td>
        <td class="table-status-row">
          <select @change="updateStatus"
                  :disabled="!(currentUser?.user?.role === 'ADMIN' || currentUser?.user?.role === 'MOD')"
                  :data-id="row?._id"
                  name="status"
                  id="status"
                  :value="row?.status">
            <option value="OK">OK</option>
            <option value="REPORTED">REPORTED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <optgroup v-if="currentUser?.user?.status === 'ADMIN'" label="">
              <option value="REMOVE">REMOVE</option>
            </optgroup>
          </select>
        </td>
      </tr>
    </template>
  </VTable>
</template>

<script>
import UserService from "../../services/UserService";
import useUser from "../../composables/user"
export default {
  name: "AdminUserList",
  data() {
    return {
      users: [],
      currentUser: {}
    }
  },
  async created() {
    const {getUser} = useUser()
    this.users = await UserService.getUsers()
    this.currentUser = getUser()
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
    },
    async updateStatus(e) {
      const userId = e?.target?.dataset?.id
      const status = e?.target?.value
      const data = { status }
      if(userId) {
        const res = await UserService.updateUser(userId, data)
        console.log(res)
      }
    },
    async updateRole(e) {
      const userId = e?.target?.dataset?.id
      const role = e?.target?.value
      const data = { role }
      if(userId) {
        const res = await UserService.updateUser(userId, data)
        console.log(res)
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
.table-updated-head,
.table-role-head,
.table-status-head {
  width: 1%;
}
select,
option {
  border: none;
  outline: none;
  background-color: var(--clr-bg);
  color: var(--clr-text);
  font-size: var(--txt-small);
}

select[disabled] {
  appearance: none;
}

</style>
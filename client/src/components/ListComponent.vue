<template>
  <VTable :data="users" sortIconPosition="before" >
    <template #head>
      <VTh :sortKey="nameLength" defaultSort="desc">Name</VTh>
      <VTh sortKey="age">Age</VTh>
      <VTh sortKey="address.state">State</VTh>
    </template>
    <template #body="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.age }}</td>
        <td>{{ row.address.state }}</td>
      </tr>
    </template>
  </VTable>
</template>

<script>
export default {
  name: "ListComponent",
  data: () => ({
      users: []
  }),
  created() {
    this.users = [
      {
        name: 'Rivera Velazquez',
        age: 37,
        address: {
          state: 'Iowa',
        },
      },
      {
        name: 'John Doe',
        age: 31,
        address: {
          state: 'New York',
        },
      },
      {
        name: 'Jane Doe',
        age: 32,
        address: {
          state: 'Alaska',
        },
      },
    ]
  },
  methods: {
    nameLength (row) {
      return row.name.length
    },
    dateSort(a, b) {
      let date1 = new Date(a.registered).getTime();
      let date2 = new Date(b.registered).getTime();

      return date1 - date2;
    }
  }
}
</script>

<style scoped>

</style>
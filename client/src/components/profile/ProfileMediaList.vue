<template>
  <div v-if="loading" class="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else class="loaded">
    <div v-if="active?.length > 0" class="watching">
      <h3>In Progress</h3>
      <ListComponent :media-list="active"/>
    </div>
    <div v-if="completed?.length > 0" class="completed">
      <h3>Completed</h3>
      <ListComponent :media-list="completed"/>
    </div>
    <div v-if="onHold?.length > 0" class="on-hold">
      <h3>On Hold</h3>
      <ListComponent :media-list="onHold"/>
    </div>
    <div v-if="dropped?.length > 0" class="dropped">
      <h3>Dropped</h3>
      <ListComponent :media-list="dropped"/>
    </div>
    <div v-if="dropped?.length === 0 && onHold?.length === 0 && completed?.length === 0 && active?.length === 0"
         class="no-content">
      <h2>Empty, no list items set.</h2>
    </div>
  </div>
</template>

<script>
import ListComponent from "../ListComponent.vue";
import MediaListService from "../../services/MediaListService";
import UserService from "../../services/UserService";

export default {
  name: "ProfileMediaList",
  components: {
    ListComponent
  },
  data() {
    return {
      active: [],
      completed: [],
      onHold: [],
      dropped: [],
      loading: true,
    }
  },
  async beforeCreate() {
    const username = this?.$route?.params?.username
    const res = await UserService.getUserByUsername(username)
    if (res.status === 200) {
      const user = res.data
      if (user?._id) {
        this.loading = true
        const list = await MediaListService.getUserMediaList(user?._id, null)
        this.active = list.filter(({status}) => ['watching', 'reading', 'playing'].includes(status))
        this.completed = list.filter(({status}) => status === 'completed')
        this.onHold = list.filter(({status}) => status === 'on-hold')
        this.dropped = list.filter(({status}) => status === 'dropped')
        this.loading = false
      }
    }

  }

}
</script>

<style scoped>
.no-content,
.loading {
  display: grid;
  place-items: center;
  margin-top: 2rem;
}

.loaded {
  display: grid;
  place-items: center;
}
.loaded > * {
  width: min(100%, 70rem);
}

h3 {
  display: block;
  width: 100%;
  max-width: min(100%, 70rem);
  padding: 1rem 0;
  background-color: var(--clr-secondary-200-1);
  text-align: center;
  font-size: var(--txt-med);
}
</style>

<template>
<div class="discussions">
  <button @click.prevent="toggle = !toggle">Add Discussion</button>
  <ThreadForm @toggle-form="toggleForm"
      @update-data="updateData"
      class="form"
      type="discussions"
      v-if="toggle"/>
  <ThreadCollection type="discussion" :threads="threads"/>
</div>
</template>

<script>
import ThreadCollection from "../components/thread/ThreadCollection.vue";
import ThreadForm from "../components/thread/ThreadForm.vue";
import ThreadService from "../ThreadService";
export default {
  name: "Discussions",
  components: {
    ThreadCollection,
    ThreadForm
  },
  data() {
    return {
      threads: [],
      toggle: false
    }
  },
  async created() {
    const res = await ThreadService.getDiscussions()
    if(res) {
      this.threads = await res
    }
  },
  methods: {
    async updateData(data) {
      console.log(data)
      if(data){
        this.threads.push(data)
      }
    },
    toggleForm(val) {
      this.toggle = val
    }
  }
}
</script>

<style scoped>
.discussions {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
  margin-block: 2rem;
}
button {
  display: block;
  margin-inline: auto;
}
.form {
  padding: 2rem;
  max-width: min(100% - 2rem, 65ch);
  margin-inline: auto;
}
</style>
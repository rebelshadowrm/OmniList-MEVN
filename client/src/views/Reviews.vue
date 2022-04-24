<template>
<div class="reviews">
  <button @click.prevent="toggle = !toggle">Add Review</button>
  <ThreadForm @toggle-form="toggleForm"
              @update-data="updateData"
              class="form"
              type="reviews"
              v-if="toggle"/>
  <ThreadCollection type="review" :threads="threads"/>
</div>
</template>

<script>
import ThreadCollection from "../components/thread/ThreadCollection.vue";
import ThreadForm from "../components/thread/ThreadForm.vue";
import ThreadService from "../services/ThreadService";
export default {
  name: "Reviews",
  components: {
    ThreadCollection,
    ThreadForm
  },
  watch: {
    threads() {
      this.getData()
    }
  },
  data() {
    return {
      threads: [],
      toggle: false
    }
  },
  async created() {
    window.scrollTo(0,0);
    await this.getData()
  },
  methods: {
    async getData() {
      try {
        const res = await ThreadService.getReviews()
        if(res) {
          this.threads = await res
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async updateData(data) {
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
.reviews {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
  margin-block: 2rem;
}
button {
  display: block;
  margin-inline: auto;
  border: none;
  border-radius: 3px;
  padding: .25rem .75rem;
  font-size: var(--txt-med);
  font-weight: 600;
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
  cursor: pointer;
}
.form {
  padding: 2rem;
  max-width: min(100% - 2rem, 65ch);
  margin-inline: auto;
}
</style>
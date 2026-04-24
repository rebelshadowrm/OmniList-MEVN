<template>
  <div :class="pageClass">
    <button @click.prevent="toggle = !toggle">{{ buttonLabel }}</button>
    <ThreadForm @toggle-form="toggleForm"
                @update-data="updateData"
                class="form"
                :type="formType"
                :initial-subject="initialSubject"
                :initial-subject-id="initialSubjectId"
                :initial-media-type="initialMediaType"
                :initial-source="initialSource"
                v-if="toggle"/>
    <ThreadCollection :type="mode" :threads="threads"/>
  </div>
</template>

<script>
import ThreadCollection from "./ThreadCollection.vue"
import ThreadForm from "./ThreadForm.vue"
import ThreadService from "../../services/ThreadService"

export default {
  name: "ThreadIndexView",
  components: {
    ThreadCollection,
    ThreadForm,
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator: value => ['discussion', 'review'].includes(value),
    },
  },
  data() {
    return {
      threads: [],
      toggle: false,
      timer: null,
    }
  },
  async created() {
    window.scrollTo(0,0)
    this.toggle = this.queryValue(this.$route.query.add) === 'true'
    await this.getData()
    this.timer = setInterval(this.getData, 20000)
  },
  computed: {
    pageClass() {
      return this.mode === 'discussion' ? 'discussions' : 'reviews'
    },
    buttonLabel() {
      return this.mode === 'discussion' ? 'Add Discussion' : 'Add Review'
    },
    formType() {
      return this.mode === 'discussion' ? 'discussions' : 'reviews'
    },
    initialSubject() {
      return this.queryValue(this.$route.query.subject) ?? ''
    },
    initialSubjectId() {
      return this.queryValue(this.$route.query.subjectId) ?? null
    },
    initialMediaType() {
      return this.queryValue(this.$route.query.mediaType) ?? 'ANIME'
    },
    initialSource() {
      return this.queryValue(this.$route.query.source) ?? 'ANILIST'
    },
  },
  beforeUnmount() {
    this.cancelAutoUpdate()
  },
  methods: {
    queryValue(value) {
      return Array.isArray(value) ? value[0] : value
    },
    async getData() {
      try {
        const res = this.mode === 'discussion'
            ? await ThreadService.getDiscussions()
            : await ThreadService.getReviews()

        if(res) {
          const filtered = res.filter(({suspended}) => suspended === false)
          filtered.sort((a, b) => b.createdAt - a.createdAt)
          this.threads = filtered
        }
      } catch(err) {
        console.log(err.message ?? err)
      }
    },
    async updateData(data) {
      if(data){
        this.threads.unshift(data)
      }
    },
    toggleForm(val) {
      this.toggle = val
    },
    cancelAutoUpdate() {
      clearInterval(this.timer)
    },
  }
}
</script>

<style scoped>
.discussions,
.reviews {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
  margin-block: 2rem;
}

button {
  display: block;
  margin-inline: auto;
  border: none;
  border-radius: var(--radius-xs);
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

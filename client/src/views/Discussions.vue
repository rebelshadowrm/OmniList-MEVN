<template>
<div class="discussions">
  <button @click.prevent="toggle = !toggle">Add Discussion</button>
  <ThreadForm @toggle-form="toggleForm"
      @update-data="updateData"
      class="form"
      type="discussions"
      :initial-subject="initialSubject"
      :initial-subject-id="initialSubjectId"
      :initial-media-type="initialMediaType"
      :initial-source="initialSource"
      v-if="toggle"/>
  <ThreadCollection type="discussion" :threads="threads"/>
</div>
</template>

<script>
import ThreadCollection from "../components/thread/ThreadCollection.vue";
import ThreadForm from "../components/thread/ThreadForm.vue";
import ThreadService from "../services/ThreadService";
export default {
  name: "Discussions",
  components: {
    ThreadCollection,
    ThreadForm
  },
  data() {
    return {
      threads: [],
      toggle: false,
      timer: ''
    }
  },
  async created() {
    window.scrollTo(0,0);
    this.toggle = this.queryValue(this.$route.query.add) === 'true'
    await this.getData()
    this.timer = setInterval(this.getData, 20000)
  },
  computed: {
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
        const res = await ThreadService.getDiscussions()
        if(res) {
          const filtered = res.filter( ({suspended}) => suspended === false)
          filtered.sort( (a, b) => {
            return  b.createdAt - a.createdAt
          })
          this.threads = filtered
        }
      } catch(err) {
        console.log(err)
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
.discussions {
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

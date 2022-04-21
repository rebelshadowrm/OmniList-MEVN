<template>
  <form @submit.prevent="onSubmit">
    <div class="input">
      <label for="title">Title</label>
      <input type="text" name="title" id="title">
    </div>
    <div class="input">
      <label for="subject">Subject</label>
      <input v-model="subject" type="text" name="subject" id="subject">
      <button @click.prevent="find">find</button>
      <input type="hidden" name="subjectId" :value="subjectId"/>
      <div v-if="searching" class="outputs">
        <p @click="select" :data-id="elem.id"
           class="output-item"
           v-for="elem in data"
           :key="elem.id"
        >{{elem.title.userPreferred}}</p>
      </div>
    </div>
    <div class="input">
      <label for="body">body</label>
      <textarea name="body" id="body"></textarea>
    </div>
    <input type="submit" value="submit">
  </form>
</template>

<script>
import ThreadService from "../../ThreadService";
import useUser from "../../composables/user"
export default {
  name: "ThreadForm",
  props: {
    type: String,
  },
  emits: ['update-data', 'toggle-form'],
  data() {
    return {
      searching: false,
      subjectId: null,
      subject: '',
      data: []
    }
  },
  created() {

  },
  methods: {
    async onSubmit(e) {
      const {title, subject, body, subjectId} = Object.fromEntries(new FormData(e.target))
      const {getUser} = useUser()
      const {user} = getUser().value
      if(subjectId?.length > 0) {
        const data = {
          user: user._id,
          title,
          subject,
          subjectId,
          body,
          comments: []
        }
        try {
          let res
          if(this.type === 'discussions') {
            res = await ThreadService.createDiscussion(data)
          }
          if(this.type === 'reviews') {
            res = await ThreadService.createReview(data)
          }
          if(res.status === 201) {
            this.$emit('update-data', res.data)
            this.$emit('toggle-form', false)
          }
        } catch(err) {
          console.log(err.message)
        }
      } else {
        this.searching = true
        await this.findSubject(subject)
      }
    },
    async findSubject(subject) {
      try {
        const url = 'https://graphql.anilist.co'
        const search = subject
        const page = 1
        const variables = { search, page }
        const query = `
              query($search: String, $page: Int) {
                Page(page: $page, perPage: 10) {
                  media(type: ANIME, search: $search) {
                    id
                    title {
                      userPreferred
                    }
                  }
                }
              }
              `
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables
          })
        }
        const res = await fetch(url, options)
        if(res.ok) {
          const {data} = await res.json()
          console.log(data)
          this.data = data.Page.media
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async select(e) {
      console.log(e.target)
      this.subjectId = e.target.dataset.id
      this.subject = e.target.textContent
      this.searching = false
    },
    async find(e) {
      this.searching = true
      await this.findSubject(this.subject)
    }
  }
}
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
}
.outputs {
  margin: 1rem .5rem;
  padding: .5rem 1rem;
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
}
.output-item {
  padding: .075rem .5rem;
  overflow: clip;
  font-size: var(--txt-small);
}
.output-item:hover {
  background-color: var(--clr-secondary-400-3);
  cursor: pointer;
  border-radius: 3px;

}
</style>
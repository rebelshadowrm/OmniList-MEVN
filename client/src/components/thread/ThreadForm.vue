<template>
  <form @submit.prevent="onSubmit">
    <span v-if="error" class="error">{{error}}</span>
    <div class="input">
      <label for="title">Title</label>
      <input v-model="title" type="text" name="title" id="title">
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
        >{{elem.title?.userPreferred ?? elem.title?.english ?? elem.title?.romaji}}</p>
      </div>
    </div>
    <div class="input">
      <label for="body">body</label>
      <textarea
          v-model="body"
          class="body"
          rows="1"
          name="body"
          id="body"
          @input="auto_height"
      ></textarea>
    </div>
    <input type="submit" value="submit">
  </form>
</template>

<script>
import ThreadService from "../../services/ThreadService";
import useUser from "../../composables/user"
import {mediaConfig} from "../../config/mediaTypes.js";
export default {
  name: "ThreadForm",
  props: {
    type: String,
    initialSubject: String,
    initialSubjectId: [Number, String],
    initialMediaType: {
      type: String,
      default: 'ANIME',
    },
    initialSource: {
      type: String,
      default: 'ANILIST',
    },
  },
  emits: ['update-data', 'toggle-form'],
  data() {
    return {
      searching: false,
      subjectId: null,
      subject: '',
      title: '',
      body: '',
      data: [],
      error: ''
    }
  },
  created() {
    this.subject = this.initialSubject ?? ''
    this.subjectId = this.initialSubjectId ?? null
  },
  methods: {
    async onSubmit(e) {
      const {title, subject, body, subjectId} = Object.fromEntries(new FormData(e.target))
      const {getUser} = useUser()
      const {user} = getUser().value
      this.error = ''
      if(title?.trim()?.length < 1 || body?.trim()?.length < 1 || subject?.trim()?.length < 1) {
        return this.error = 'Invalid entry! Make sure all the forms are filled'
      }
      if(subjectId?.length > 0) {
        const data = {
          user: user._id,
          title,
          subject,
          subjectId,
          mediaType: this.initialMediaType,
          source: this.initialSource,
          sourceId: `${subjectId}`,
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
            this.title = ''
            this.body = ''
            this.subject = ''
            this.subjectId = null
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
      if (this.initialSource === 'TMDB') {
        await this.findTmdbSubject(subject)
        return
      }

      try {
        const url = 'https://graphql.anilist.co'
        const search = subject
        const page = 1
        const type = this.initialMediaType
        const variables = { search, page, type }
        const query = `
              query($search: String, $page: Int, $type: MediaType) {
                Page(page: $page, perPage: 10) {
                  media(type: $type, search: $search) {
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
          this.data = data.Page.media
        }
      } catch(err) {
        console.log(err.message)
      }
    },
    async findTmdbSubject(subject) {
      try {
        const params = new URLSearchParams()
        params.set('search', subject)

        const res = await fetch(`/api/tmdb/${mediaConfig(this.initialMediaType).path}/search?${params.toString()}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message ?? res.statusText)
        }

        this.data = data
      } catch(err) {
        console.log(err.message)
      }
    },
    async select(e) {
      this.subjectId = e.target.dataset.id
      this.subject = e.target.textContent
      this.searching = false
    },
    async find(e) {
      this.searching = true
      await this.findSubject(this.subject)
    },
    auto_height(e) {
      e.target.style.height = "1px";
      e.target.style.height = (e.target.scrollHeight)+"px";
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input {
  display: flex;
  flex-direction: column;
}
.body,
input[type=text]{
  outline: none;
  border: none;
  line-height: 1.25;
  width: 100%;
  resize: none;
  background-color: var(--clr-bg);
  color: var(--clr-text);
  padding: .5em;
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
  background-color: var(--clr-secondary-200-1);
  cursor: pointer;
  border-radius: var(--radius-xs);
}
label {
  margin-bottom: .175rem;
}
input[type=submit],
button {
  border: none;
  border-radius: var(--radius-xs);
  max-width: fit-content;
  padding: .25rem .75rem;
  font-size: var(--txt-med);
  font-weight: 600;
  margin-block: .5rem;
  place-self: end;
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
  cursor: pointer;
}
</style>

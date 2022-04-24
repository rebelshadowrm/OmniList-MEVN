<template>
  <form :data-thread="id"
        :data-user="user?.user?._id"
        @submit.prevent="onSubmit"
  >
    <div class="user">
        <img :src="user?.user?.img ?? `https://picsum.photos/seed/${user?.user?.userName}/50`" alt="">
    </div>
    <div class="input">
      <textarea
          v-model="comment"
          @click="this.buttons = true"
          rows="1"
          class="comment"
          name="comment"
          id="comment"
          placeholder="Add a comment..."
          @input="auto_height"
      ></textarea>
      <hr/>
    </div>
    <div v-if="buttons" class="buttons">
      <button class="cancel-button" @click.prevent="cancel">cancel</button>
      <input
          :class="comment.length > 0 ? 'submit' : 'disabled'"
          type="submit"
          value="comment"
      />
    </div>
  </form>
</template>

<script>

import useUser from "../../composables/user";
import ThreadService from "../../services/ThreadService";

export default {
  name: "ThreadCreateResponse",
  props: {
    id: [Number, String],
    type: String,
  },
  data() {
    return {
      comment: '',
      isLoggedIn: false,
      user: {},
      buttons: false,
    }
  },
  created() {
    const {getIsLoggedIn, getUser} = useUser()
    this.isLoggedIn = getIsLoggedIn()
    this.user = getUser()
  },
  methods: {
    async onSubmit(e) {
      const {comment} = Object.fromEntries(new FormData(e.target))
      if(comment.length > 0) {
        try {
          if(this.type === 'discussion') {
            const data = {
              discussionId: e.target.dataset.thread,
              userId: e.target.dataset.user,
              comment
            }
            const res = await ThreadService.createDiscussionComment(data)
            if(res.status === 201) {
              this.$emit('update-replies', res.data)
              this.cancel()
            }
          }
          if(this.type === 'review') {
            const data = {
              reviewId: e.target.dataset.thread,
              userId: e.target.dataset.user,
              comment
            }
            const res = await ThreadService.createReviewComment(data)
            if(res.status === 201) {
              this.$emit('update-replies', res.data)
              this.cancel()
            }
          }


        } catch(err) {
          console.log(err.message)
        }
      }
    },
    cancel() {
      this.buttons = false
      this.comment = ''
      document.querySelector('.comment').style.height = "max-content"
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
  display: grid;
  grid-template-areas:
    'user input'
    'user buttons';
  grid-template-columns: max-content 1fr;
  column-gap: 1rem;
  padding: 1.25rem .75rem .5rem 1rem;
  margin-inline: 1.25rem;

}
.user {
  grid-area: user;
}
.user img {
  border-radius: var(--radius);
}
.input {
  grid-area: input;
}
input[type=submit],
button {
  border: none;
  padding: .25em .5em;
  font-weight: 500;
}
.comment {
  outline: none;
  border: none;
  line-height: 1.25;
  width: 100%;
  resize: none;
  background-color: transparent;
  color: var(--clr-text);
  font-size: var(--txt-small);
}
hr {
  margin-top: 0;
}
.buttons {
  grid-area: buttons;
  display: flex;
  place-content: end;
}
.cancel-button {
  background-color: transparent;
  color: var(--clr-text);
  cursor: pointer;
}
.submit {
  background: var(--clr-btn-bg);
  color: var(--clr-btn);
  cursor: pointer;
}
.disabled {
  background-color: hsl(0deg 0% 25%);
  color: hsl(0deg 0% 65%);
}
</style>
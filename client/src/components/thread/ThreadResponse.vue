<template>
<div class="response">
  <p class="username">
    <router-link :to="`/profile/${response?.comment?.user?.userName}`">
      <img :src="response?.comment?.user?.img ?? `https://picsum.photos/seed/${response?.comment?.user?.userName}/50`" alt="">
    </router-link>
    <router-link :to="`/profile/${response?.comment?.user?.userName}`">{{response?.comment?.user?.userName}}</router-link>
  </p>
  <span :data-id="response?._id" role="textbox" contenteditable="false" class="comment">{{response?.comment?.comment}}</span>
  <div class="inputs">
    <hr/>
    <div class="buttons">
      <button @click="cancel" class="cancel">cancel</button>
      <button @click="saveComment" class="save">save</button>
    </div>
  </div>
  <i @click="menuToggle = !menuToggle" class="fas fa-ellipsis-v"></i>
  <ul  v-if="menuToggle" class="menu">
    <li v-if="response?.comment?.user?._id !== loggedInUser?.user?._id"
        @click="reportComment" class="menu-item">Report</li>
    <li v-if="loggedInUser?.user?.role === 'admin'"
        @click="suspendComment" class="menu-item">Suspend</li>
    <li v-if="response?.comment?.user?._id === loggedInUser?.user?._id"
        @click="editComment" class="menu-item">Edit</li>
    <li v-if="response?.comment?.user?._id === loggedInUser?.user?._id"
        @click="deleteComment" class="menu-item">Delete</li>
  </ul>

</div>
</template>

<script>
import useUser from "../../composables/user"
import ThreadService from "../../ThreadService";
export default {
  name: "ThreadResponse",
  props: {
    response: {},
    id: [String, Number],
    type: String,
  },
  data() {
    return {
      menuToggle: false,
      loggedInUser: {},
      revertComment: '',
    }
  },
  created() {
    const {getUser} = useUser()
    this.loggedInUser = getUser()
  },
  methods: {
    reportComment(e) {
      this.menuToggle = false;
      const comment = e.target.parentNode.parentNode.querySelector(".comment")
      const commentId = comment.dataset.id
    },
    suspendComment(e) {
      this.menuToggle = false;
      const comment = e.target.parentNode.parentNode.querySelector(".comment")
      const commentId = comment.dataset.id
    },
    editComment(e) {
      this.menuToggle = false;
      const comment = e.target.parentNode.parentNode.querySelector(".comment")
      this.revertComment = comment.textContent
      comment.contentEditable = true
    },
    async saveComment(e){
      const comment = e.target.parentNode.parentNode.parentNode.querySelector(".comment")
      const commentId = comment.dataset.id
      if(this.type === 'discussion') {
        const data = {
          discussionId: this.id,
          commentId,
          comment: comment.textContent
        }
        const res = await ThreadService.updateDiscussionComment(data)
        if(res.status === 200) {
          comment.contentEditable = false
        }
      }
      if(this.type === 'review') {
        const data = {
          reviewId: this.id,
          commentId,
          comment: comment.textContent
        }
        const res = await ThreadService.updateReviewComment(data)
        if(res.status === 200) {
          comment.contentEditable = false
        }
      }
    },
    async deleteComment(e) {
      this.menuToggle = false;
      const comment = e.target.parentNode.parentNode.querySelector(".comment")
      const commentId = comment.dataset.id
      if(this.type === 'discussion') {
        const data = {
          discussionId: this.id,
          commentId
        }
        const res = await ThreadService.deleteDiscussionComment(data)
        if(res.status === 204) {
          comment.parentNode.remove()
        }
      }
      if(this.type === 'review') {
        const data = {
          reviewId: this.id,
          commentId
        }
        const res = await ThreadService.deleteReviewComment(data)
        if(res.status === 204) {
          comment.parentNode.remove()
        }
      }
    },
    cancel(e) {
      const comment = e.target.parentNode.parentNode.parentNode.querySelector(".comment")
      comment.textContent = this.revertComment
      comment.contentEditable = false
    },
  }
}
</script>

<style scoped>
.response {
  position: relative;
  margin-inline: 1rem;
  padding: 1em 2em;
  /*
  background-color: var(--clr-bg);
  border-width: 1px;
  border-style: solid;
  border-color: var(--clr-border);
  border-radius: var(--radius);
   */
}
.comment {
  line-height: 1.25;
  display: inline-block;
  margin: .25rem 0 0 0;
  font-size: var(--txt-small);
  width: 100%;
  color: var(--clr-text);
  background-color: transparent;
  border: none;
  outline: none;
}
.comment[contenteditable = false] {
  cursor: default;
}
.comment[contenteditable = false] + .inputs {
  display: none;
}
.buttons {
  display: flex;
  place-content: end;
}
button {
  border: none;
  outline: none;
  font-weight: 500;
  padding: .15rem .55rem;
  font-size: var(--txt-med);
}
.cancel {
  background-color: transparent;
  color: var(--clr-text);
  cursor: pointer;
}
.save {
  background-color: var(--clr-secondary-600);
  color: var(--clr-text);
  cursor: pointer;
}
hr {
  margin-top: 0;
}
i {
  position: absolute;
  inset: 1rem 2rem auto auto;
  padding: .5rem;
  border-radius: 100vw;
  opacity: 0;
  cursor: pointer;
}
.response:hover i {
  opacity: 1
}
.menu {
  position: absolute;
  inset: 3.5rem -1.75rem auto auto;
  user-select: none;
  z-index: 1;
  padding: .25rem;
  border-width: 1px;
  border-radius: 3px;
  border-style: solid;
  border-color: var(--clr-border);
  background-color: var(--clr-bg);
}
.menu-item {
  padding: 0 .5rem;
}
.menu-item:hover {
  background-color: var(--clr-secondary-600-3);
  cursor: pointer;
}
.username {
  display: flex;
  gap: .5rem;
}
.username img {
  height: 35px;
  border-radius: var(--radius);
}
.username a {
  display: block;
  font-size: var(--txt-small);
  text-decoration: none;
  color: var(--clr-text);
  max-width: fit-content;
  align-self: end;
}
</style>
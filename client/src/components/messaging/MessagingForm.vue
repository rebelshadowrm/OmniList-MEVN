<template>
  <form @submit.prevent="onSubmit">
    <div class="input">
      <textarea
          class="reply"
          rows="1"
          name="reply"
          id="reply"
          @input="auto_height"
      ></textarea>
    </div>
    <hr/>
    <input type="submit" :value="message?.message?.length > 0 ? 'reply' : 'create'">
  </form>
</template>

<script>
export default {
  name: "MessagingForm",
  props: {
    message: Object,
  },
  methods: {
    auto_height(e) {
      e.target.style.height = "1px";
      e.target.style.height = (e.target.scrollHeight)+"px";
    },
    async onSubmit(e) {
      const {reply} = Object.fromEntries(new FormData(e.target))
      console.log(reply)
    }
  }
}
</script>

<style scoped>
.reply {
  width: 100%;
  resize: none;
  line-height: 1;
  background-color: hsl(0deg 0% 15%);
  color: var(--clr-text);
  padding: .5rem .5rem 0 .5rem;
  border: none;
  outline: none;
  font-size: var(--txt-med);
}
hr {
  margin-top: -.25rem;
}
input[type=submit] {
  border: none;
  border-radius: 3px;
  max-width: fit-content;
  padding: .25rem .75rem;
  font-size: var(--txt-med);
  font-weight: 600;
  margin-block: .5rem;
  place-self: end;
  color: var(--clr-text);
  background-color: var(--clr-secondary-600);
  cursor: pointer;
}
</style>
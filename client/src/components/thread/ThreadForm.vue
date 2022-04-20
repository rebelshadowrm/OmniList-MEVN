<template>
  <form @submit.prevent="onSubmit">
    <div class="input">
      <label for="title">Title</label>
      <input type="text" name="title" id="title">
    </div>
    <div class="input">
      <label for="subject">Subject</label>
      <input type="text" name="subject" id="subject">
      <button @click.prevent="find">find</button>
      <div v-if="searching" class="outputs">
        <p @click="select" data-id="elem.id"
           class="output-item"
           v-for="elem in data"
           :key="elem.id"
        ></p>
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
export default {
  name: "ThreadForm",
  props: {
    subject: String,
  },
  data() {
    return {
      searching: false,
      data: []
    }
  },
  created() {

  },
  methods: {
    async onSubmit(e) {

    },
    async select(e) {

    },
    async find(e) {
      this.searching = true
    }
  }
}
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
}
</style>
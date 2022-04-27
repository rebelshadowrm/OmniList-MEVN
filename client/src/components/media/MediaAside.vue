<template>
  <div>
    <div v-for="info in infos" :key="info.id" class="aside-item">
      <p class="aside-title">{{ info.title }}</p>
      <div class="aside-info">
        <p v-for="value in info.values" :key="value.id">{{ value.value }}</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "MediaAside",
  props: {
    infos: Array,
  }
}
</script>

<style scoped>
.aside-item {
  padding: 1rem 1rem 0 1rem;
  min-width: max-content;
}

.aside-title {
  font-weight: 500;
}

.aside-info p {
  font-weight: 300;
  max-width: 18ch;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}

@media only screen and (max-width: 48.375rem) {
  .aside-info {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  .aside-title {
    font-weight: 300;
  }

  .aside-info p {
    font-weight: 500;
    max-width: 100%;
  }

}

</style>
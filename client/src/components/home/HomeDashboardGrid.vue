<template>
  <section class="dashboard-grid" :style="gridStyle">
    <div v-for="module in modules"
         :key="module.id"
         class="dashboard-module"
         :data-module-type="module.type"
         :data-cols="module.colSpan"
         :data-rows="module.rowSpan"
         :style="moduleStyle(module)">
      <component :is="componentFor(module)"
                 v-bind="componentProps(module)" />
    </div>
  </section>
</template>

<script>
import HomeCommunityModule from "./HomeCommunityModule.vue"
import HomeMediaSection from "./HomeMediaSection.vue"
import News from "../News.vue"

export default {
  name: "HomeDashboardGrid",
  props: {
    modules: {
      type: Array,
      required: true,
    },
    rows: {
      type: Number,
      default: 6,
    },
    columns: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    gridStyle() {
      return {
        '--dashboard-columns': this.columns,
        '--dashboard-rows': this.rows,
      }
    },
  },
  methods: {
    moduleStyle(module) {
      return {
        '--module-col': module.col,
        '--module-row': module.row,
        '--module-col-span': module.colSpan,
        '--module-row-span': module.rowSpan,
      }
    },
    componentFor(module) {
      return {
        community: HomeCommunityModule,
        media: HomeMediaSection,
        news: News,
      }[module.type]
    },
    componentProps(module) {
      if (module.type === 'media') {
        return {
          mediaType: module.mediaType,
          title: module.title,
          eyebrow: module.eyebrow,
          cols: module.colSpan,
          rows: module.rowSpan,
        }
      }

      if (module.type === 'news') {
        return {
          cols: module.colSpan,
          rows: module.rowSpan,
          limit: this.newsLimit(module),
          orientation: module.colSpan === 2 || module.rowSpan === 1 ? 'horizontal' : 'vertical',
        }
      }

      return {
        cols: module.colSpan,
        rows: module.rowSpan,
      }
    },
    newsLimit(module) {
      if (module.colSpan === 2 && module.rowSpan === 1) return 5
      if (module.rowSpan === 1) return 2
      if (module.rowSpan === 2) return 4
      return 6
    },
  },
}
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(var(--dashboard-columns), minmax(0, 1fr));
  grid-template-rows: repeat(var(--dashboard-rows), 10rem);
  grid-auto-flow: dense;
  gap: 1.25rem;
  align-items: stretch;
}

.dashboard-module {
  grid-column: var(--module-col) / span var(--module-col-span);
  grid-row: var(--module-row) / span var(--module-row-span);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.dashboard-module > * {
  height: 100%;
}

@media (max-width: 58rem) {
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .dashboard-module {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>

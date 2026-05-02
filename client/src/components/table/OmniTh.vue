<template>
  <th class="v-th" @click="toggleSort">
    <div>
      <span v-if="iconBefore" class="sort-icon" aria-hidden="true">{{ sortIcon }}</span>
      <span><slot :sort-order="order"></slot></span>
      <span v-if="!iconBefore" class="sort-icon" aria-hidden="true">{{ sortIcon }}</span>
    </div>
  </th>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
import { SORT_CONTEXT } from './OmniTable.vue'

let nextSortId = 0

export default {
  name: 'OmniTh',
  props: {
    sortKey: {
      type: [String, Function],
      default: null,
    },
    customSort: {
      type: Function,
      default: null,
    },
    defaultSort: {
      type: String,
      default: null,
      validator: value => value === null || ['asc', 'desc'].includes(value),
    },
  },
  setup(props) {
    const table = inject(SORT_CONTEXT, null)
    const id = `omni-th-${nextSortId += 1}`
    const order = ref(0)

    function commitSort() {
      table?.setSort({
        id,
        sortKey: props.sortKey,
        customSort: props.customSort,
        order: order.value,
      })
    }

    function toggleSort() {
      if (!props.sortKey && !props.customSort) {
        return
      }

      order.value = order.value === 1 ? -1 : 1
      commitSort()
    }

    onMounted(() => {
      if (props.defaultSort === 'asc') {
        order.value = 1
        commitSort()
      }

      if (props.defaultSort === 'desc') {
        order.value = -1
        commitSort()
      }
    })

    return {
      order,
      toggleSort,
      iconBefore: table?.sortState?.iconPosition === 'before',
      get sortIcon() {
        if (table?.sortState?.id !== id || order.value === 0) {
          return '↕'
        }

        return order.value === 1 ? '↑' : '↓'
      },
    }
  },
}
</script>

<style scoped>
.sort-icon {
  display: inline-block;
  min-width: 1em;
  opacity: .75;
}
</style>

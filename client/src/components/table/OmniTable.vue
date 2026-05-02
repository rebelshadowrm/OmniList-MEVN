<template>
  <table class="v-table omni-table">
    <thead>
      <slot name="head" :rows="displayRows"></slot>
    </thead>
    <tbody>
      <slot name="body" :rows="displayRows"></slot>
    </tbody>
  </table>
</template>

<script>
import { computed, provide, reactive } from 'vue'

const SORT_CONTEXT = Symbol('omni-table-sort')

function valueAtPath(row, path) {
  if (typeof path === 'function') {
    return path(row)
  }

  return `${path ?? ''}`
      .split('.')
      .filter(Boolean)
      .reduce((value, key) => value?.[key], row)
}

function compareValues(a, b) {
  const left = a ?? ''
  const right = b ?? ''

  if (Number.isFinite(Number(left)) && Number.isFinite(Number(right)) && `${left}` !== '' && `${right}` !== '') {
    return Number(left) - Number(right)
  }

  return `${left}`.localeCompare(`${right}`, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export { SORT_CONTEXT }

export default {
  name: 'OmniTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    sortIconPosition: {
      type: String,
      default: 'after',
    },
    pageSize: {
      type: Number,
      default: null,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const sortState = reactive({
      id: null,
      sortKey: null,
      customSort: null,
      order: 0,
      iconPosition: props.sortIconPosition,
    })

    function setSort({ id, sortKey, customSort, order }) {
      sortState.id = id
      sortState.sortKey = sortKey
      sortState.customSort = customSort
      sortState.order = order
    }

    provide(SORT_CONTEXT, {
      sortState,
      setSort,
    })

    const sortedRows = computed(() => {
      if (!sortState.order || (!sortState.sortKey && !sortState.customSort)) {
        return props.data
      }

      return [...props.data].sort((a, b) => {
        if (typeof sortState.customSort === 'function') {
          return sortState.customSort(a, b, sortState.order)
        }

        return compareValues(valueAtPath(a, sortState.sortKey), valueAtPath(b, sortState.sortKey)) * sortState.order
      })
    })

    const displayRows = computed(() => {
      if (!props.pageSize) {
        return sortedRows.value
      }

      const page = Math.max(Number(props.currentPage) || 1, 1)
      const start = (page - 1) * props.pageSize

      return sortedRows.value.slice(start, start + props.pageSize)
    })

    return {
      displayRows,
    }
  },
}
</script>

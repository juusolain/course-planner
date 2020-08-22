<template>
    <b-button :type="type" size="is-small" @click="toggle">{{group.groupKey}}</b-button>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  props: ['group'],
  methods: {
    toggle () {
      CourseManager.selectGroup(this.group.groupKey)
    }
  },
  computed: {
    type () {
      const baseType = 'is-primary'
      if (CourseManager.isSelected(this.group.groupKey)) {
        return `${baseType}`
      } else {
        return `${baseType} is-light`
      }
    }
  }
}
</script>

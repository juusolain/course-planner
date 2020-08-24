<template>
  <b-tooltip :delay="250" :label="group.teacher" class="groupbutton">
    <b-button :type="type" size="is-small" @click="toggle">{{group.groupKey}}</b-button>
  </b-tooltip>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  props: ['group', 'activeYear'],
  methods: {
    toggle () {
      if (!this.group.selected) {
        CourseManager.selectGroup(this.group)
      } else {
        CourseManager.removeGroup(this.group)
      }
    }
  },
  computed: {
    type () {
      let light = 'is-light'
      if (this.group.selected) {
        light = ''
      }
      if (!this.group.selected && this.group.courseSelected) {
        return `${light} is-warning`
      }
      if (!CourseManager.canSelect(this.group, true)) {
        return `${light} is-danger`
      }
      if (CourseManager.isCourseWanted(this.group.courseKey, this.activeYear)) {
        return `${light} is-success`
      } else if (this.group.selected) {
        return 'is-dark'
      } else {
        return 'is-light'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.groupbutton{
  margin: 0.1em;
}
</style>

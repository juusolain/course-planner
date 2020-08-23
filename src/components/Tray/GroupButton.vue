<template>
  <b-tooltip :delay="250" :label="group.teacher" class="groupbutton">
    <b-button :type="type" size="is-small" @click="toggle">{{group.groupKey}}</b-button>
  </b-tooltip>
</template>

<script>
import CourseManager from '@/scripts/courses.js'

export default {
  props: ['group'],
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
      if (CourseManager.isCourseWanted(this.group.courseKey)) {
        return `${light} is-success`
      }
      if (!CourseManager.canSelect(this.group, true)) {
        return `${light} is-danger`
      }
      return light
    }
  }
}
</script>

<style lang="scss" scoped>
.groupbutton{
  margin: 0.1em;
}
</style>
